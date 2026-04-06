import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/utils/formatters.dart';
import '../../../shared/widgets/loading_widget.dart';

class CustomerDetailScreen extends ConsumerStatefulWidget {
  final String customerId;
  const CustomerDetailScreen({super.key, required this.customerId});

  @override
  ConsumerState<CustomerDetailScreen> createState() => _CustomerDetailScreenState();
}

class _CustomerDetailScreenState extends ConsumerState<CustomerDetailScreen> {
  Map<String, dynamic>? _customer;
  List<dynamic> _debts = [];
  List<dynamic> _sales = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final dio = await ApiClient.instance;
      final results = await Future.wait([
        dio.get('/customers/${widget.customerId}'),
        dio.get('/debts', queryParameters: {'customerId': widget.customerId}),
        dio.get('/sales'),
      ]);
      if (mounted) {
        setState(() {
          _customer = results[0].data as Map<String, dynamic>;
          _debts = (results[1].data as List).where((d) => d['status'] != 'paid').toList();
          final allSales = results[2].data as List;
          _sales = allSales
              .where((s) => s['customerId'] == widget.customerId)
              .take(10)
              .toList();
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _payDebt(String debtId, double remaining) async {
    final ctrl = TextEditingController(text: remaining.toStringAsFixed(0));
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Погасить долг'),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Сумма', suffixText: 'UZS'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Отмена')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Оплатить')),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      final dio = await ApiClient.instance;
      await dio.post('/debts/$debtId/pay', data: {
        'amount': double.parse(ctrl.text.replaceAll(' ', '')),
      });
      _load();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Долг погашен'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    final c = _customer;
    if (c == null) return const Scaffold(body: Center(child: Text('Не найдено')));

    final totalDebt = num.tryParse(c['totalDebt']?.toString() ?? '0') ?? 0;

    return Scaffold(
      appBar: AppBar(title: Text(c['name'] as String? ?? '')),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Info card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 32,
                      backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.1),
                      child: Text(
                        (c['name'] as String? ?? '?')[0].toUpperCase(),
                        style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(c['name'] as String? ?? '',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(c['phone'] as String? ?? '',
                        style: TextStyle(color: Colors.grey[600])),
                    if (totalDebt > 0) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.orange.shade200),
                        ),
                        child: Text(
                          'Долг: ${formatMoney(totalDebt)}',
                          style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            if (_debts.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Text('Долги', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ..._debts.map((d) {
                final remaining = num.tryParse(d['remainingAmount']?.toString() ?? '0') ?? 0;
                return Card(
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Colors.orange,
                      child: Icon(Icons.warning_amber, color: Colors.white, size: 20),
                    ),
                    title: Text(formatMoney(remaining),
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
                    subtitle: Text(
                      d['createdAt'] != null
                          ? formatDate(d['createdAt'] as String?)
                          : '',
                    ),
                    trailing: ElevatedButton(
                      onPressed: () => _payDebt(d['id'] as String, remaining.toDouble()),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                      ),
                      child: const Text('Оплатить'),
                    ),
                  ),
                );
              }),
            ],

            if (_sales.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Text('Последние покупки', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ..._sales.map((s) {
                final total = num.tryParse(s['totalAmount']?.toString() ?? '0') ?? 0;
                final paid = num.tryParse(s['paidAmount']?.toString() ?? '0') ?? 0;
                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: paid >= total
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.orange.withValues(alpha: 0.1),
                      child: Icon(
                        paid >= total ? Icons.check : Icons.pending,
                        color: paid >= total ? Colors.green : Colors.orange,
                        size: 20,
                      ),
                    ),
                    title: Text(formatMoney(total),
                        style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text(
                      s['createdAt'] != null
                          ? formatDate(s['createdAt'] as String?)
                          : '',
                    ),
                    trailing: Text(
                      s['saleNumber'] as String? ?? '',
                      style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                    ),
                  ),
                );
              }),
            ],

            if (_debts.isEmpty && _sales.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text('Нет истории покупок', style: TextStyle(color: Colors.grey)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
