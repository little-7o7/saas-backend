import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/providers/api_providers.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../core/utils/formatters.dart';

class ProductsScreen extends ConsumerWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productsProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(productsProvider),
      child: products.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка загрузки',
          onRetry: () => ref.invalidate(productsProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyWidget(
              message: 'Товаров нет.\nНажмите + чтобы добавить.',
              icon: Icons.inventory_2,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: list.length,
            itemBuilder: (_, i) =>
                _ProductTile(product: list[i] as Map<String, dynamic>),
          );
        },
      ),
    );
  }
}

class _ProductTile extends StatelessWidget {
  final Map<String, dynamic> product;
  const _ProductTile({required this.product});

  @override
  Widget build(BuildContext context) {
    final variants =
        (product['variants'] as List?)?.cast<Map<String, dynamic>>() ?? [];

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: ExpansionTile(
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFF2563EB).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(Icons.inventory_2_outlined,
              color: Color(0xFF2563EB), size: 22),
        ),
        title: Text(
          product['name'] as String? ?? '',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Row(
          children: [
            Text('SKU: ${product['sku'] ?? ''}',
                style: const TextStyle(fontSize: 11)),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                product['unit'] == 'meter' ? 'м' : 'шт',
                style: const TextStyle(fontSize: 10),
              ),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              formatMoney(product['retailPrice'] ?? 0),
              style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: Color(0xFF2563EB)),
            ),
            Text(
              '${variants.length} вар.',
              style: TextStyle(fontSize: 11, color: Colors.grey[500]),
            ),
          ],
        ),
        children: [
          // Prices row
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Row(
              children: [
                _priceChip('Закупка',
                    formatMoney(product['purchasePrice'] ?? 0), Colors.grey),
                const SizedBox(width: 8),
                _priceChip('Оптом',
                    formatMoney(product['wholesalePrice'] ?? 0), Colors.blue),
                const SizedBox(width: 8),
                _priceChip('Розница',
                    formatMoney(product['retailPrice'] ?? 0), Colors.green),
              ],
            ),
          ),
          // Variants
          if (variants.isNotEmpty)
            ...variants.map((v) {
              final label = [v['color'], v['grade']]
                  .where((x) => x != null && (x as String).isNotEmpty)
                  .join(' • ');
              return ListTile(
                dense: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 24),
                leading: CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.blue.withOpacity(0.1),
                  child: Text(
                    (v['color'] as String? ?? v['grade'] as String? ?? '?')[0]
                        .toUpperCase(),
                    style: const TextStyle(
                        fontSize: 11,
                        color: Colors.blue,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                title: Text(
                    label.isNotEmpty ? label : v['sku'] as String? ?? '',
                    style: const TextStyle(fontSize: 13)),
                subtitle: Text('SKU: ${v['sku'] ?? ''}',
                    style: const TextStyle(fontSize: 11)),
              );
            }),
          const SizedBox(height: 4),
        ],
      ),
    );
  }

  Widget _priceChip(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Text(label,
                style: TextStyle(
                    fontSize: 9, color: color, fontWeight: FontWeight.w600)),
            const SizedBox(height: 2),
            Text(value.replaceAll(' UZS', ''),
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: color)),
          ],
        ),
      ),
    );
  }
}
