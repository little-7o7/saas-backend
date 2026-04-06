import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client.dart';

// Products
final productsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/products');
  return res.data as List<dynamic>;
});

// Customers
final customersProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/customers');
  return res.data as List<dynamic>;
});

// Sales
final salesProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final now = DateTime.now();
  final from = DateTime(now.year, now.month, 1).toIso8601String();
  final res = await dio.get('/sales', queryParameters: {'from': from});
  return res.data as List<dynamic>;
});

// Orders
final ordersProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/orders');
  return res.data as List<dynamic>;
});

// Debts
final debtsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/debts');
  return res.data as List<dynamic>;
});

// Warehouses
final warehousesProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/warehouses');
  return res.data as List<dynamic>;
});

// Warehouse stock
final stockProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/warehouses/stock');
  return res.data as List<dynamic>;
});

// Employees
final employeesProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/employees');
  return res.data as List<dynamic>;
});

// Expenses
final expensesProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/expenses');
  return res.data as List<dynamic>;
});

// Black cash balance
final blackCashProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final res = await dio.get('/black-cash/balance');
  return res.data as Map<String, dynamic>;
});

// Analytics dashboard
final analyticsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final dio = await ApiClient.instance;
  final now = DateTime.now();
  final from = DateTime(now.year, now.month, 1).toIso8601String();
  final to = now.toIso8601String();
  final res = await dio.get('/analytics/dashboard',
      queryParameters: {'from': from, 'to': to});
  return res.data as Map<String, dynamic>;
});
