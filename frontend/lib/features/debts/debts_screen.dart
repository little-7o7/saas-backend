import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client.dart';
import '../../core/utils/formatters.dart';
import '../../shared/providers/api_providers.dart';
import '../../shared/widgets/loading_widget.dart';

class DebtsScreen extends ConsumerWidget {
  const DebtsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final debts = ref.watch(debtsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Долги')),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(debtsProvider),
        child: debts.when(
          loading: () => const LoadingWidget(),
          error: (e, _) => ErrorWidget2(
            message: 'Ошибка загрузки',
            onRetry: () => ref.invalidate(debtsProvider),
          ),
          data: (list) {
            final open = list.where((d) {
              final status = (d as Map<String, dynamic>)['status'] as String?;
              return status != 'paid';
            }).toList();

            if (open.isEmpty) {
              return const EmptyWidget(
                message: 'Долгов нет. 🎉',
                icon: Icons.check_circle_outline,
              );
            }

            final total = open.fold<double>(0, (s, d) {
              return s + (num.tryParse((d as Map<String, dynamic>)['remainingAmount']?.toString() ?? '0') ?? 0).toDouble();
            });

            return Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.red.shade50,
                  child: Row(
                    children: [
                      const Icon(Icons.warning_amber, color: Colors.red),
                      const SizedBox(width: 8),
                      Text(
                        'Всего долгов: ${formatMoney(total)}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.red, fontSize: 15),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: open.length,
                    itemBuilder: (_, i) {
                      final d = open[i] as Map<String, dynamic>;
                      final customer = d['customer'] as Map<String, dynamic>? ?? {};
                      final remaining = num.tryParse(d['remainingAmount']?.toString() ?? '0') ?? 0;
                      final status = d['status'] as String? ?? 'open';

                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Colors.orange.withValues(alpha: 0.15),
                            child: Text(
                              (customer['name'] as String? ?? '?')[0].toUpperCase(),
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, color: Colors.orange),
                            ),
                          ),
                          title: Text(customer['name'] as String? ?? 'Неизвестный',
                              style: const TextStyle(fontWeight: FontWeight.w600)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(customer['phone'] as String? ?? ''),
                              Text(
                                formatDate(d['createdAt'] as String?),
                                style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                              ),
                            ],
                          ),
                          isThreeLine: true,
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                formatMoney(remaining),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange,
                                    fontSize: 13),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: status == 'partial'
                                      ? Colors.blue.shade50
                                      : Colors.orange.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  status == 'partial' ? 'Частично' : 'Открыт',
                                  style: TextStyle(
                                      fontSize: 10,
                                      color: status == 'partial' ? Colors.blue : Colors.orange),
                                ),
                              ),
                            ],
                          ),
                          onTap: () => _payDebt(context, ref, d['id'] as String, remaining.toDouble()),
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _payDebt(BuildContext context, WidgetRef ref, String debtId, double remaining) async {
    final ctrl = TextEditingController(text: remaining.toStringAsFixed(0));
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Погасить долг'),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(labelText: 'Сумма', suffixText: 'UZS'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Отмена')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
            child: const Text('Оплатить'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      final dio = await ApiClient.instance;
      await dio.post('/debts/$debtId/pay', data: {
        'amount': double.parse(ctrl.text.replaceAll(' ', '')),
      });
      ref.invalidate(debtsProvider);
      ref.invalidate(customersProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Долг погашен'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }
}
