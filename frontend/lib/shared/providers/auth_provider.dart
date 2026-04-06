import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client.dart';
import '../../core/utils/storage.dart';

class AuthState {
  final bool isLoggedIn;
  final Map<String, dynamic>? user;
  final Map<String, dynamic>? tenant;

  const AuthState({
    this.isLoggedIn = false,
    this.user,
    this.tenant,
  });

  AuthState copyWith({
    bool? isLoggedIn,
    Map<String, dynamic>? user,
    Map<String, dynamic>? tenant,
  }) {
    return AuthState(
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      user: user ?? this.user,
      tenant: tenant ?? this.tenant,
    );
  }

  String get tenantId => user?['tenantId'] as String? ?? '';
  String get role => user?['role'] as String? ?? '';
  String get userName => user?['name'] as String? ?? '';
  String get storeName => tenant?['name'] as String? ?? '';
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _init();
    return const AuthState();
  }

  Future<void> _init() async {
    final token = await getToken();
    final user = await getUser();
    final tenant = await getTenant();
    if (token != null && user != null) {
      state = AuthState(isLoggedIn: true, user: user, tenant: tenant);
    }
  }

  Future<void> login(String phone, String password) async {
    final dio = await ApiClient.instance;
    final res = await dio.post('/auth/login', data: {
      'phone': phone,
      'password': password,
    });
    await _handleAuthResponse(res.data as Map<String, dynamic>);
  }

  Future<void> register(
    String storeName,
    String ownerName,
    String phone,
    String password,
  ) async {
    final dio = await ApiClient.instance;
    final res = await dio.post('/auth/register', data: {
      'storeName': storeName,
      'ownerName': ownerName,
      'phone': phone,
      'password': password,
    });
    await _handleAuthResponse(res.data as Map<String, dynamic>);
  }

  Future<void> _handleAuthResponse(Map<String, dynamic> data) async {
    final token = data['token'] as String;
    final user = data['user'] as Map<String, dynamic>;
    final tenant = data['tenant'] as Map<String, dynamic>?;

    await saveToken(token);
    await saveUser(user);
    if (tenant != null) await saveTenant(tenant);

    ApiClient.reset();
    state = AuthState(isLoggedIn: true, user: user, tenant: tenant);
  }

  Future<void> logout() async {
    await clearAll();
    ApiClient.reset();
    state = const AuthState();
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(
  AuthNotifier.new,
);
