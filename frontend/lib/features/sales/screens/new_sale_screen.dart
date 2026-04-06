import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/api/api_client.dart';
import '../../../shared/providers/api_providers.dart';
import '../../../core/utils/formatters.dart';

class _SaleItem {
  final String productId;
  final String productName;
  final String? variantId;
  final String variantLabel;
  double quantity;
  final double unitPrice;

  _SaleItem({
    required this.productId,
    required this.productName,
    this.variantId,
    this.variantLabel = '',
    this.quantity = 1,
    required this.unitPrice,
  });

  double get total => quantity * unitPrice;
}

class NewSaleScreen extends ConsumerStatefulWidget {
  const NewSaleScreen({super.key});
  @override
  ConsumerState<NewSaleScreen> createState() => _NewSaleScreenState();
}

class _NewSaleScreenState extends ConsumerState<NewSaleScreen> {
  final List<_SaleItem> _items = [];
  final _paidCtrl = TextEditingController();
  String? _customerId;
  String? _customerName;
  String _paymentType = 'cash';
  bool _loading = false;

  double get _total => _items.fold(0, (s, i) => s + i.total);
  double get _paid => double.tryParse(_paidCtrl.text.replaceAll(' ', '')) ?? 0;
  double get _debt => (_total - _paid).clamp(0, double.maxFinite);

  @override
  void dispose() {
    _paidCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Добавьте хотя бы один товар')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final dio = await ApiClient.instance;
      await dio.post('/sales', data: {
        'customerId': _customerId,
        'items': _items
            .map((i) => {
                  'productId': i.productId,
                  'variantId': i.variantId,
                  'quantity': i.quantity,
                  'unitPrice': i.unitPrice,
                })
            .toList(),
        'paidAmount': _paid,
        'paymentType': _paymentType,
      });

      ref.invalidate(salesProvider);
      ref.invalidate(analyticsProvider);
      ref.invalidate(debtsProvider);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Продажа сохранена. Накладная отправлена.'),
            backgroundColor: Colors.green,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Ошибка: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _pickProduct() async {
    final products = ref.read(productsProvider).asData?.value ?? [];
    if (products.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Сначала добавьте товары')),
      );
      return;
    }

    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      builder: (_) => _ProductPickerSheet(products: products),
    );

    if (result != null && mounted) {
      setState(() {
        _items.add(_SaleItem(
          productId: result['productId'] as String,
          productName: result['productName'] as String,
          variantId: result['variantId'] as String?,
          variantLabel: result['variantLabel'] as String? ?? '',
          unitPrice: (result['price'] as num).toDouble(),
        ));
      });
    }
  }

  void _pickCustomer() async {
    final customers = ref.read(customersProvider).asData?.value ?? [];
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      builder: (_) => _CustomerPickerSheet(customers: customers),
    );
    if (result != null && mounted) {
      setState(() {
        _customerId = result['id'] as String;
        _customerName = result['name'] as String;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Новая продажа'),
        actions: [
          TextButton(
            onPressed: _loading ? null : _save,
            child: const Text('Сохранить',
                style: TextStyle(
                    color: Color(0xFF2563EB),
                    fontWeight: FontWeight.bold,
                    fontSize: 15)),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(12),
              children: [
                // Customer
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.person_outline),
                    title: Text(_customerName ?? 'Выбрать клиента'),
                    subtitle: _customerName == null
                        ? const Text('Необязательно')
                        : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: _pickCustomer,
                  ),
                ),
                const SizedBox(height: 8),

                // Items
                ..._items.asMap().entries.map((e) =>
                    _ItemCard(item: e.value, onDelete: () {
                      setState(() => _items.removeAt(e.key));
                    }, onQtyChange: (q) {
                      setState(() => e.value.quantity = q);
                    })),

                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: _pickProduct,
                  icon: const Icon(Icons.add),
                  label: const Text('Добавить товар'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 16),

                // Payment type
                const Text('Способ оплаты',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    _payBtn('cash', 'Наличные', Icons.money),
                    _payBtn('card', 'Карта', Icons.credit_card),
                    _payBtn('transfer', 'Перевод', Icons.swap_horiz),
                  ],
                ),
              ],
            ),
          ),

          // Bottom totals
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              boxShadow: [
                BoxShadow(
                    blurRadius: 12,
                    color: Colors.black.withOpacity(0.08),
                    offset: const Offset(0, -2))
              ],
            ),
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Итого:',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold)),
                    Text(formatMoney(_total),
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _paidCtrl,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Оплачено',
                    suffixText: 'UZS',
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                if (_debt > 0) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.orange.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.warning_amber,
                            color: Colors.orange, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          'Долг: ${formatMoney(_debt)}',
                          style: const TextStyle(
                              color: Colors.orange,
                              fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _loading
                        ? const CircularProgressIndicator(
                            color: Colors.white, strokeWidth: 2)
                        : const Text('Сохранить продажу',
                            style: TextStyle(
                                fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _payBtn(String type, String label, IconData icon) {
    final selected = _paymentType == type;
    return ChoiceChip(
      avatar: Icon(icon, size: 16,
          color: selected ? Colors.white : Colors.grey),
      label: Text(label),
      selected: selected,
      onSelected: (_) => setState(() => _paymentType = type),
      selectedColor: const Color(0xFF2563EB),
      labelStyle: TextStyle(color: selected ? Colors.white : null),
    );
  }
}

class _ItemCard extends StatelessWidget {
  final _SaleItem item;
  final VoidCallback onDelete;
  final void Function(double) onQtyChange;

  const _ItemCard({
    required this.item,
    required this.onDelete,
    required this.onQtyChange,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.productName,
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      if (item.variantLabel.isNotEmpty)
                        Text(item.variantLabel,
                            style: TextStyle(
                                fontSize: 12, color: Colors.grey[600])),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.red),
                  onPressed: onDelete,
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Text('${formatMoney(item.unitPrice)} × ',
                    style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                // Qty stepper
                IconButton(
                  icon: const Icon(Icons.remove_circle_outline, size: 20),
                  onPressed: item.quantity > 0.5
                      ? () => onQtyChange(item.quantity - 1)
                      : null,
                ),
                Text(item.quantity.toStringAsFixed(
                    item.quantity == item.quantity.floorToDouble() ? 0 : 1)),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline, size: 20),
                  onPressed: () => onQtyChange(item.quantity + 1),
                ),
                const Spacer(),
                Text(
                  formatMoney(item.total),
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductPickerSheet extends StatefulWidget {
  final List<dynamic> products;
  const _ProductPickerSheet({required this.products});

  @override
  State<_ProductPickerSheet> createState() => _ProductPickerSheetState();
}

class _ProductPickerSheetState extends State<_ProductPickerSheet> {
  String _search = '';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.products
        .cast<Map<String, dynamic>>()
        .where((p) =>
            (p['name'] as String? ?? '')
                .toLowerCase()
                .contains(_search.toLowerCase()))
        .toList();

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.7,
      maxChildSize: 0.95,
      builder: (_, ctrl) => Column(
        children: [
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              autofocus: true,
              decoration: InputDecoration(
                hintText: 'Поиск товара...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onChanged: (v) => setState(() => _search = v),
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: ctrl,
              itemCount: filtered.length,
              itemBuilder: (_, i) {
                final p = filtered[i];
                final variants =
                    (p['variants'] as List?)?.cast<Map<String, dynamic>>() ??
                        [];

                if (variants.isEmpty) {
                  return ListTile(
                    title: Text(p['name'] as String? ?? ''),
                    subtitle: Text('SKU: ${p['sku'] ?? ''}'),
                    trailing: Text(
                        formatMoney(p['retailPrice'] ?? 0),
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    onTap: () => Navigator.pop(context, {
                      'productId': p['id'],
                      'productName': p['name'],
                      'price': num.tryParse(
                              p['retailPrice']?.toString() ?? '0') ??
                          0,
                    }),
                  );
                }

                return ExpansionTile(
                  title: Text(p['name'] as String? ?? ''),
                  subtitle: Text('${variants.length} вариантов'),
                  children: variants.map((v) {
                    final label = [v['color'], v['grade']]
                        .where((x) => x != null)
                        .join(' • ');
                    return ListTile(
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 28),
                      title: Text(label.isNotEmpty ? label : v['sku'] ?? ''),
                      subtitle: Text('SKU: ${v['sku'] ?? ''}'),
                      trailing: Text(
                          formatMoney(p['retailPrice'] ?? 0),
                          style:
                              const TextStyle(fontWeight: FontWeight.bold)),
                      onTap: () => Navigator.pop(context, {
                        'productId': p['id'],
                        'productName': p['name'],
                        'variantId': v['id'],
                        'variantLabel': label,
                        'price': num.tryParse(
                                p['retailPrice']?.toString() ?? '0') ??
                            0,
                      }),
                    );
                  }).toList(),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _CustomerPickerSheet extends StatefulWidget {
  final List<dynamic> customers;
  const _CustomerPickerSheet({required this.customers});

  @override
  State<_CustomerPickerSheet> createState() => _CustomerPickerSheetState();
}

class _CustomerPickerSheetState extends State<_CustomerPickerSheet> {
  String _search = '';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.customers
        .cast<Map<String, dynamic>>()
        .where((c) =>
            (c['name'] as String? ?? '')
                .toLowerCase()
                .contains(_search.toLowerCase()) ||
            (c['phone'] as String? ?? '').contains(_search))
        .toList();

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.6,
      maxChildSize: 0.9,
      builder: (_, ctrl) => Column(
        children: [
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              autofocus: true,
              decoration: InputDecoration(
                hintText: 'Имя или телефон...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onChanged: (v) => setState(() => _search = v),
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: ctrl,
              itemCount: filtered.length,
              itemBuilder: (_, i) {
                final c = filtered[i];
                final debt = num.tryParse(
                        c['totalDebt']?.toString() ?? '0') ??
                    0;
                return ListTile(
                  leading: CircleAvatar(child: Text(
                      (c['name'] as String? ?? '?')[0].toUpperCase())),
                  title: Text(c['name'] as String? ?? ''),
                  subtitle: Text(c['phone'] as String? ?? ''),
                  trailing: debt > 0
                      ? Text('Долг: ${formatMoney(debt)}',
                          style: const TextStyle(
                              color: Colors.orange, fontSize: 12))
                      : null,
                  onTap: () => Navigator.pop(context, c),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
