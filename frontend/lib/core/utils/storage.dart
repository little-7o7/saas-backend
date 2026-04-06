import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

const _storage = FlutterSecureStorage();

Future<void> saveToken(String token) async {
  await _storage.write(key: 'jwt_token', value: token);
}

Future<String?> getToken() async {
  return _storage.read(key: 'jwt_token');
}

Future<void> clearToken() async {
  await _storage.delete(key: 'jwt_token');
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
  await _storage.deleteAll();
  final prefs = await SharedPreferences.getInstance();
  await prefs.clear();
}
