import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../shared/providers/api_providers.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../core/utils/formatters.dart';

class SalesScreen extends ConsumerWidget {
  const SalesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sales = ref.watch(salesProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(salesProvider),
      child: sales.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка загрузки продаж',
          onRetry: () => ref.invalidate(salesProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyWidget(
              message: 'Продаж ещё нет.\nНажмите + для новой продажи.',
              icon: Icons.receipt_long,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: list.length,
            itemBuilder: (_, i) => _SaleTile(sale: list[i] as Map<String, dynamic>),
          );
        },
      ),
    );
  }
}

class _SaleTile extends StatelessWidget {
  final Map<String, dynamic> sale;
  const _SaleTile({required this.sale});

  @override
  Widget build(BuildContext context) {
    final customer = sale['customer'] as Map<String, dynamic>?;
    final debt = num.tryParse(sale['debtAmount']?.toString() ?? '0') ?? 0;
    final total = num.tryParse(sale['totalAmount']?.toString() ?? '0') ?? 0;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: debt > 0
              ? Colors.orange.withOpacity(0.15)
              : Colors.green.withOpacity(0.15),
          child: Icon(
            debt > 0 ? Icons.warning_amber : Icons.check_circle,
            color: debt > 0 ? Colors.orange : Colors.green,
          ),
        ),
        title: Text(
          customer?['name'] as String? ?? 'Анонимный покупатель',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(formatDateTime(sale['createdAt'] as String?)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              formatMoney(total),
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            if (debt > 0)
              Text(
                'Долг: ${formatMoney(debt)}',
                style: const TextStyle(color: Colors.orange, fontSize: 11),
              ),
          ],
        ),
        onTap: () => context.push('/home/sales/${sale['id']}'),
      ),
    );
  }
}
