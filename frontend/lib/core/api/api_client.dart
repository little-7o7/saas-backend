import 'package:dio/dio.dart';
import 'package:uuid/uuid.dart';
import '../constants/api.dart';
import '../utils/storage.dart';

class ApiClient {
  static Dio? _dio;
  static String? _deviceId;

  static Future<Dio> get instance async {
    _dio ??= await _buildDio();
    return _dio!;
  }

  static Future<String> _getDeviceId() async {
    if (_deviceId != null) return _deviceId!;
    const uuid = Uuid();
    _deviceId = uuid.v4();
    return _deviceId!;
  }

  static Future<Dio> _buildDio() async {
    final deviceId = await _getDeviceId();

    final dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'x-device-id': deviceId},
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          await clearAll();
        }
        return handler.next(error);
      },
    ));

    return dio;
  }

  static void reset() => _dio = null;
}
