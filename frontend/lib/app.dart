import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/auth/screens/register_screen.dart';
import 'features/sales/screens/new_sale_screen.dart';
import 'features/products/screens/add_product_screen.dart';
import 'features/customers/screens/add_customer_screen.dart';
import 'features/customers/screens/customer_detail_screen.dart';
import 'features/warehouse/warehouse_screen.dart';
import 'features/debts/debts_screen.dart';
import 'features/admin/admin_screen.dart';
import 'shared/screens/home_screen.dart';
import 'shared/providers/auth_provider.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    initialLocation: auth.isLoggedIn
        ? (auth.role == 'super_admin' ? '/admin' : '/home')
        : '/login',
    redirect: (context, state) {
      final loggedIn = auth.isLoggedIn;
      final isAdmin = auth.role == 'super_admin';
      final isAuth = state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/register');

      if (!loggedIn && !isAuth) return '/login';
      if (loggedIn && isAuth) return isAdmin ? '/admin' : '/home';
      if (loggedIn && isAdmin && state.matchedLocation.startsWith('/home')) return '/admin';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
      GoRoute(path: '/admin', builder: (_, __) => const AdminScreen()),
      ShellRoute(
        builder: (_, __, child) => child,
        routes: [
          GoRoute(
            path: '/home',
            builder: (_, __) => const HomeScreen(),
            routes: [
              GoRoute(
                path: 'sales/new',
                builder: (_, __) => const NewSaleScreen(),
              ),
              GoRoute(
                path: 'products/new',
                builder: (_, __) => const AddProductScreen(),
              ),
              GoRoute(
                path: 'customers/new',
                builder: (_, __) => const AddCustomerScreen(),
              ),
              GoRoute(
                path: 'customers/:id',
                builder: (_, state) => CustomerDetailScreen(
                  customerId: state.pathParameters['id']!,
                ),
              ),
              GoRoute(
                path: 'warehouse',
                builder: (_, __) => const WarehouseScreen(),
              ),
              GoRoute(
                path: 'debts',
                builder: (_, __) => const DebtsScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

class SaasApp extends ConsumerWidget {
  const SaasApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'SaaS Shop',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        cardTheme: const CardThemeData(elevation: 1),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          scrolledUnderElevation: 0,
        ),
      ),
      routerConfig: router,
    );
  }
}
