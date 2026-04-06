import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

Future<void> saveToken(String token) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('jwt_token', token);
}

Future<String?> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('jwt_token');
}

Future<void> clearToken() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('jwt_token');
}

Future<void> saveUser(Map<String, dynamic> user) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('current_user', jsonEncode(user));
}

Future<Map<String, dynamic>?> getUser() async {
  final prefs = await SharedPreferences.getInstance();
  final str = prefs.getString('current_user');
  if (str == null) return null;
  return jsonDecode(str) as Map<String, dynamic>;
}

Future<void> saveTenant(Map<String, dynamic> tenant) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('current_tenant', jsonEncode(tenant));
}

Future<Map<String, dynamic>?> getTenant() async {
  final prefs = await SharedPreferences.getInstance();
  final str = prefs.getString('current_tenant');
  if (str == null) return null;
  return jsonDecode(str) as Map<String, dynamic>;
}

Future<void> clearAll() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.clear();
}
