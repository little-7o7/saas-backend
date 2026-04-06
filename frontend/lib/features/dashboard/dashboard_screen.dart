import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/providers/api_providers.dart';
import '../../shared/widgets/stat_card.dart';
import '../../shared/widgets/loading_widget.dart';
import '../../core/utils/formatters.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analytics = ref.watch(analyticsProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(analyticsProvider),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          analytics.when(
            loading: () => const LoadingWidget(),
            error: (e, _) => ErrorWidget2(
              message: 'Не удалось загрузить данные',
              onRetry: () => ref.invalidate(analyticsProvider),
            ),
            data: (data) => _buildStats(context, data),
          ),
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, Map<String, dynamic> data) {
    final revenue = data['revenue'] as Map<String, dynamic>? ?? {};
    final expenses = data['expenses'] as Map<String, dynamic>? ?? {};
    final debts = data['debts'] as Map<String, dynamic>? ?? {};
    final stockValue = data['stockValue'] as Map<String, dynamic>? ?? {};
    final colorSales = data['colorSales'] as List? ?? [];
    final gradeSales = data['gradeSales'] as List? ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle('Финансы (этот месяц)'),
        const SizedBox(height: 8),
        StatCard(
          title: 'Оборот',
          value: formatMoney(revenue['total'] ?? 0),
          icon: Icons.trending_up,
          color: Colors.blue,
        ),
        const SizedBox(height: 10),
        StatCard(
          title: 'Получено',
          value: formatMoney(revenue['paid'] ?? 0),
          icon: Icons.monetization_on,
          color: Colors.green,
        ),
        const SizedBox(height: 10),
        StatCard(
          title: 'Прибыль',
          value: formatMoney(data['profit'] ?? 0),
          icon: Icons.savings,
          color: const Color(0xFF7C3AED),
        ),
        const SizedBox(height: 10),
        StatCard(
          title: 'Расходы',
          value: formatMoney(expenses['total'] ?? 0),
          icon: Icons.payments_outlined,
          color: Colors.orange,
          onTap: () => context.push('/home/expenses'),
        ),
        const SizedBox(height: 10),
        StatCard(
          title: 'Долги клиентов',
          value: formatMoney(debts['total'] ?? 0),
          icon: Icons.warning_amber_rounded,
          color: Colors.red,
          onTap: () => context.push('/home/debts'),
        ),
        const SizedBox(height: 10),
        StatCard(
          title: 'Стоимость склада (розница)',
          value: formatMoney(stockValue['retail_value'] ?? 0),
          icon: Icons.warehouse_outlined,
          color: Colors.teal,
          onTap: () => context.push('/home/warehouse'),
        ),

        if (colorSales.isNotEmpty) ...[
          const SizedBox(height: 24),
          _sectionTitle('Продажи по цветам'),
          const SizedBox(height: 8),
          _colorGradeTable(colorSales, 'color'),
        ],

        if (gradeSales.isNotEmpty) ...[
          const SizedBox(height: 24),
          _sectionTitle('Продажи по сортам'),
          const SizedBox(height: 8),
          _colorGradeTable(gradeSales, 'grade'),
        ],
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _sectionTitle(String text) {
    return Text(
      text,
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    );
  }

  Widget _colorGradeTable(List items, String key) {
    return Card(
      child: Column(
        children: items.take(5).map<Widget>((item) {
          final label = item[key] as String? ?? '—';
          final qty = item['total_qty']?.toString() ?? '0';
          final rev = formatMoney(item['total_revenue'] ?? 0);
          return ListTile(
            dense: true,
            leading: CircleAvatar(
              radius: 14,
              backgroundColor: _colorForLabel(label).withOpacity(0.15),
              child: Text(label[0].toUpperCase(),
                  style: TextStyle(
                      fontSize: 12,
                      color: _colorForLabel(label),
                      fontWeight: FontWeight.bold)),
            ),
            title: Text(label, style: const TextStyle(fontSize: 14)),
            subtitle: Text('$qty шт', style: const TextStyle(fontSize: 12)),
            trailing: Text(rev,
                style: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w600)),
          );
        }).toList(),
      ),
    );
  }

  Color _colorForLabel(String label) {
    final colors = [
      Colors.blue,
      Colors.red,
      Colors.green,
      Colors.purple,
      Colors.orange,
      Colors.teal,
    ];
    return colors[label.hashCode.abs() % colors.length];
  }
}
