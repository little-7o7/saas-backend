import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../shared/providers/api_providers.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../core/utils/formatters.dart';

class CustomersScreen extends ConsumerWidget {
  const CustomersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final customers = ref.watch(customersProvider);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(customersProvider),
      child: customers.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка загрузки',
          onRetry: () => ref.invalidate(customersProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyWidget(
              message: 'Клиентов нет.',
              icon: Icons.people,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: list.length,
            itemBuilder: (_, i) {
              final c = list[i] as Map<String, dynamic>;
              final debt =
                  num.tryParse(c['totalDebt']?.toString() ?? '0') ?? 0;
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: debt > 0
                        ? Colors.orange.withOpacity(0.15)
                        : const Color(0xFF2563EB).withOpacity(0.1),
                    child: Text(
                      (c['name'] as String? ?? '?')[0].toUpperCase(),
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: debt > 0
                              ? Colors.orange
                              : const Color(0xFF2563EB)),
                    ),
                  ),
                  title: Text(c['name'] as String? ?? '',
                      style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text(c['phone'] as String? ?? ''),
                  trailing: debt > 0
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text('Долг',
                                style: TextStyle(
                                    fontSize: 10, color: Colors.orange)),
                            Text(
                              formatMoney(debt),
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange,
                                  fontSize: 13),
                            ),
                          ],
                        )
                      : const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () => context.push('/home/customers/${c['id']}'),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
