import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/api/api_client.dart';
import '../../core/utils/formatters.dart';
import '../../shared/providers/auth_provider.dart';
import '../../shared/widgets/loading_widget.dart';

// Providers
final adminStatsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/admin/stats');
  return res.data as Map<String, dynamic>;
});

final adminTenantsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/admin/tenants', queryParameters: {'limit': 100});
  return (res.data as Map<String, dynamic>)['items'] as List<dynamic>;
});

final adminAuditProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/admin/audit-logs', queryParameters: {'limit': 50});
  return (res.data as Map<String, dynamic>)['items'] as List<dynamic>;
});

class AdminScreen extends ConsumerStatefulWidget {
  const AdminScreen({super.key});
  @override
  ConsumerState<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends ConsumerState<AdminScreen> {
  int _index = 0;

  final _titles = ['Обзор', 'Магазины', 'Логи'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_index],
            style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _index,
        children: const [
          _StatsTab(),
          _TenantsTab(),
          _AuditTab(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Обзор',
          ),
          NavigationDestination(
            icon: Icon(Icons.store_outlined),
            selectedIcon: Icon(Icons.store),
            label: 'Магазины',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history),
            label: 'Логи',
          ),
        ],
      ),
    );
  }
}

// ── Stats Tab ──────────────────────────────────────────────
class _StatsTab extends ConsumerWidget {
  const _StatsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stats = ref.watch(adminStatsProvider);
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(adminStatsProvider),
      child: stats.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка: $e',
          onRetry: () => ref.invalidate(adminStatsProvider),
        ),
        data: (data) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Платформа',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _statCard('Всего магазинов',
                  data['total_tenants']?.toString() ?? '0', Icons.store, Colors.blue)),
              const SizedBox(width: 12),
              Expanded(child: _statCard('Активных',
                  data['active_tenants']?.toString() ?? '0', Icons.check_circle, Colors.green)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _statCard('Пользователей',
                  data['total_users']?.toString() ?? '0', Icons.people, Colors.purple)),
              const SizedBox(width: 12),
              Expanded(child: _statCard('Продаж',
                  data['total_sales']?.toString() ?? '0', Icons.receipt_long, Colors.orange)),
            ]),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  const Icon(Icons.monetization_on, color: Colors.green, size: 28),
                  const SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Общая выручка платформы',
                        style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(
                      formatMoney(num.tryParse(data['total_revenue']?.toString() ?? '0') ?? 0),
                      style: const TextStyle(
                          fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green),
                    ),
                  ]),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value,
                style: TextStyle(
                    fontSize: 22, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(label,
                style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// ── Tenants Tab ────────────────────────────────────────────
class _TenantsTab extends ConsumerWidget {
  const _TenantsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tenants = ref.watch(adminTenantsProvider);
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(adminTenantsProvider),
      child: tenants.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка: $e',
          onRetry: () => ref.invalidate(adminTenantsProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyWidget(message: 'Магазинов нет', icon: Icons.store);
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: list.length,
            itemBuilder: (_, i) {
              final t = list[i] as Map<String, dynamic>;
              final isBlocked = t['isBlocked'] == true;
              final status = t['status'] as String? ?? 'trial';

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isBlocked
                        ? Colors.red.withValues(alpha: 0.1)
                        : Colors.green.withValues(alpha: 0.1),
                    child: Icon(
                      isBlocked ? Icons.block : Icons.store,
                      color: isBlocked ? Colors.red : Colors.green,
                      size: 20,
                    ),
                  ),
                  title: Text(t['name'] as String? ?? '',
                      style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(t['phone'] as String? ?? ''),
                      Text('slug: ${t['slug'] ?? ''}',
                          style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                  isThreeLine: true,
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: _statusColor(status, isBlocked).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _statusLabel(status, isBlocked),
                          style: TextStyle(
                              fontSize: 11,
                              color: _statusColor(status, isBlocked),
                              fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  onTap: () => _showTenantActions(context, ref, t),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Color _statusColor(String status, bool blocked) {
    if (blocked) return Colors.red;
    switch (status) {
      case 'active': return Colors.green;
      case 'trial': return Colors.blue;
      default: return Colors.grey;
    }
  }

  String _statusLabel(String status, bool blocked) {
    if (blocked) return 'Заблокирован';
    switch (status) {
      case 'active': return 'Активен';
      case 'trial': return 'Пробный';
      default: return status;
    }
  }

  void _showTenantActions(
      BuildContext context, WidgetRef ref, Map<String, dynamic> tenant) {
    final isBlocked = tenant['isBlocked'] == true;
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.info_outline),
              title: Text(tenant['name'] as String? ?? ''),
              subtitle: Text('ID: ${tenant['id']}',
                  style: const TextStyle(fontSize: 11)),
            ),
            const Divider(),
            ListTile(
              leading: Icon(
                isBlocked ? Icons.lock_open : Icons.block,
                color: isBlocked ? Colors.green : Colors.red,
              ),
              title: Text(
                isBlocked ? 'Разблокировать' : 'Заблокировать',
                style: TextStyle(color: isBlocked ? Colors.green : Colors.red),
              ),
              onTap: () async {
                Navigator.pop(context);
                await _toggleBlock(context, ref, tenant['id'] as String, isBlocked);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _toggleBlock(BuildContext context, WidgetRef ref,
      String tenantId, bool currentlyBlocked) async {
    try {
      final dio = await ApiClient.instance;
      if (currentlyBlocked) {
        await dio.post('/admin/tenants/$tenantId/unblock');
      } else {
        await dio.post('/admin/tenants/$tenantId/block',
            data: {'reason': 'Заблокировано администратором'});
      }
      ref.invalidate(adminTenantsProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(currentlyBlocked ? '✅ Разблокирован' : '🚫 Заблокирован'),
          backgroundColor: currentlyBlocked ? Colors.green : Colors.red,
        ));
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red));
      }
    }
  }
}

// ── Audit Tab ──────────────────────────────────────────────
class _AuditTab extends ConsumerWidget {
  const _AuditTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final logs = ref.watch(adminAuditProvider);
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(adminAuditProvider),
      child: logs.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => ErrorWidget2(
          message: 'Ошибка: $e',
          onRetry: () => ref.invalidate(adminAuditProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyWidget(message: 'Логов нет', icon: Icons.history);
          }
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: list.length,
            itemBuilder: (_, i) {
              final log = list[i] as Map<String, dynamic>;
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                child: ListTile(
                  dense: true,
                  leading: CircleAvatar(
                    radius: 16,
                    backgroundColor: Colors.blue.withValues(alpha: 0.1),
                    child: const Icon(Icons.history, size: 16, color: Colors.blue),
                  ),
                  title: Text(log['action'] as String? ?? '—',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: Text(
                    '${log['entityType'] ?? ''} • ${formatDate(log['createdAt'] as String?)}',
                    style: const TextStyle(fontSize: 11),
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
