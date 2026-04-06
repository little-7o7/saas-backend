import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/providers/auth_provider.dart';

class MoreScreen extends ConsumerWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Profile card
        Card(
          child: ListTile(
            leading: CircleAvatar(
              radius: 24,
              backgroundColor: const Color(0xFF2563EB).withOpacity(0.1),
              child: Text(
                auth.userName.isNotEmpty ? auth.userName[0].toUpperCase() : '?',
                style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2563EB)),
              ),
            ),
            title: Text(auth.userName,
                style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(auth.role.toUpperCase(),
                style: const TextStyle(fontSize: 11)),
          ),
        ),
        const SizedBox(height: 16),
        const _SectionHeader('Управление'),
        _tile(context, Icons.warehouse_outlined, 'Склад',
            () => context.push('/home/warehouse')),
        _tile(context, Icons.people_outline, 'Сотрудники',
            () => context.push('/home/employees')),
        _tile(context, Icons.payments_outlined, 'Расходы',
            () => context.push('/home/expenses')),
        _tile(context, Icons.account_balance_wallet_outlined, 'Долги',
            () => context.push('/home/debts')),
        _tile(context, Icons.lock_outline, 'Чёрная касса',
            () => context.push('/home/black-cash')),
        const SizedBox(height: 8),
        const _SectionHeader('Настройки'),
        _tile(context, Icons.settings_outlined, 'Настройки магазина',
            () => context.push('/home/settings')),
        _tile(context, Icons.receipt_long_outlined, 'Накладные',
            () => context.push('/home/invoices')),
        _tile(context, Icons.bar_chart, 'Аналитика',
            () => context.push('/home/analytics')),
        const SizedBox(height: 8),
        const _SectionHeader('Аккаунт'),
        _tile(context, Icons.logout, 'Выйти', () async {
          await ref.read(authProvider.notifier).logout();
          if (context.mounted) context.go('/login');
        }, color: Colors.red),
      ],
    );
  }

  Widget _tile(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap, {
    Color? color,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 4),
      child: ListTile(
        leading: Icon(icon, color: color),
        title: Text(label, style: TextStyle(color: color)),
        trailing: const Icon(Icons.chevron_right, size: 18),
        onTap: onTap,
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader(this.title);
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 8, 4, 6),
      child: Text(
        title,
        style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.grey[500],
            letterSpacing: 0.5),
      ),
    );
  }
}
