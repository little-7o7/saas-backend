import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client.dart';
import '../../core/utils/formatters.dart';
import '../../shared/providers/api_providers.dart';
import '../../shared/widgets/loading_widget.dart';

class WarehouseScreen extends ConsumerStatefulWidget {
  const WarehouseScreen({super.key});
  @override
  ConsumerState<WarehouseScreen> createState() => _WarehouseScreenState();
}

class _WarehouseScreenState extends ConsumerState<WarehouseScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Склад'),
        bottom: TabBar(
          controller: _tabCtrl,
          tabs: const [Tab(text: 'Остатки'), Tab(text: 'Склады')],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: const [_StockTab(), _WarehousesTab()],
      ),
    );
  }
}

class _StockTab extends ConsumerWidget {
  const _StockTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stock = ref.watch(stockProvider);
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(stockProvider),
      child: stock.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка загрузки',
          onRetry: () => ref.invalidate(stockProvider),
        ),
        data: (items) {
          if (items.isEmpty) {
            return const EmptyWidget(
              message: 'Склад пуст.\nДобавьте товары и поступления.',
              icon: Icons.warehouse,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: items.length,
            itemBuilder: (_, i) {
              final item = items[i] as Map<String, dynamic>;
              final variant = item['variant'] as Map<String, dynamic>? ?? {};
              final product = variant['product'] as Map<String, dynamic>? ?? {};
              final warehouse = item['warehouse'] as Map<String, dynamic>? ?? {};
              final qty = num.tryParse(item['quantity']?.toString() ?? '0') ?? 0;
              final minQty = num.tryParse(item['minQuantity']?.toString() ?? '0') ?? 0;
              final isLow = qty <= minQty && minQty > 0;

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isLow
                        ? Colors.red.withValues(alpha: 0.1)
                        : const Color(0xFF2563EB).withValues(alpha: 0.1),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      color: isLow ? Colors.red : const Color(0xFF2563EB),
                      size: 20,
                    ),
                  ),
                  title: Text(
                    product['name'] as String? ?? variant['sku'] as String? ?? '—',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  subtitle: Text(warehouse['name'] as String? ?? ''),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '${qty.toStringAsFixed(qty == qty.floorToDouble() ? 0 : 1)} шт',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: isLow ? Colors.red : Colors.green,
                        ),
                      ),
                      if (isLow)
                        const Text('Мало!',
                            style: TextStyle(fontSize: 10, color: Colors.red)),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _WarehousesTab extends ConsumerStatefulWidget {
  const _WarehousesTab();
  @override
  ConsumerState<_WarehousesTab> createState() => _WarehousesTabState();
}

class _WarehousesTabState extends ConsumerState<_WarehousesTab> {
  void _addWarehouse() async {
    final nameCtrl = TextEditingController();
    final addrCtrl = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Новый склад'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Название *'),
              autofocus: true,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: addrCtrl,
              decoration: const InputDecoration(labelText: 'Адрес'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Отмена')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Создать')),
        ],
      ),
    );
    if (confirmed != true || nameCtrl.text.isEmpty) return;
    try {
      final dio = await ApiClient.instance;
      await dio.post('/warehouses', data: {
        'name': nameCtrl.text.trim(),
        if (addrCtrl.text.isNotEmpty) 'address': addrCtrl.text.trim(),
      });
      ref.invalidate(warehousesProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Склад создан'), backgroundColor: Colors.green),
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
    final warehouses = ref.watch(warehousesProvider);
    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(warehousesProvider),
        child: warehouses.when(
          loading: () => const LoadingWidget(),
          error: (e, _) => ErrorWidget2(
            message: 'Ошибка загрузки',
            onRetry: () => ref.invalidate(warehousesProvider),
          ),
          data: (list) {
            if (list.isEmpty) {
              return const EmptyWidget(
                message: 'Складов нет.\nНажмите + чтобы добавить.',
                icon: Icons.warehouse,
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: list.length,
              itemBuilder: (_, i) {
                final w = list[i] as Map<String, dynamic>;
                return Card(
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFF2563EB),
                      child: Icon(Icons.warehouse, color: Colors.white, size: 20),
                    ),
                    title: Text(w['name'] as String? ?? '',
                        style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text(w['address'] as String? ?? 'Адрес не указан'),
                  ),
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addWarehouse,
        child: const Icon(Icons.add),
      ),
    );
  }
}
