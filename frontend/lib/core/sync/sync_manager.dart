import 'dart:convert';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_client.dart';
import '../db/local_database.dart';

class SyncManager {
  static const _lastSyncKey = 'last_sync_timestamp';

  static Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result.any((r) => r != ConnectivityResult.none);
  }

  static Future<void> push() async {
    if (!await isOnline()) return;
    final pending = await LocalDatabase.getPendingSync();
    if (pending.isEmpty) return;

    final changes = pending.map((row) => {
          'entityType': row['entity_type'],
          'entityId': row['entity_id'],
          'operation': row['operation'],
          'payload': jsonDecode(row['payload'] as String),
          'clientTimestamp': row['client_timestamp'],
        }).toList();

    try {
      final dio = await ApiClient.instance;
      await dio.post('/sync/push', data: {'changes': changes});
      for (final row in pending) {
        await LocalDatabase.markSynced(row['id'] as String);
      }
    } catch (_) {}
  }

  static Future<void> pull(String tenantId) async {
    if (!await isOnline()) return;
    final prefs = await SharedPreferences.getInstance();
    final lastSync = prefs.getString(_lastSyncKey) ?? '';

    try {
      final dio = await ApiClient.instance;
      final response = await dio.get(
        '/sync/pull',
        queryParameters: {'lastSync': lastSync},
      );

      final data = response.data as Map<String, dynamic>;
      final changes = data['changes'] as List;
      final serverTime = data['serverTime'] as String;

      for (final change in changes) {
        await _applyChange(
          tenantId,
          change['entityType'] as String,
          change['operation'] as String,
          change['payload'] as Map<String, dynamic>,
        );
      }
      await prefs.setString(_lastSyncKey, serverTime);
    } catch (_) {}
  }

  static Future<void> _applyChange(
    String tenantId,
    String entityType,
    String operation,
    Map<String, dynamic> payload,
  ) async {
    switch (entityType) {
      case 'products':
        await LocalDatabase.upsertProduct({...payload, 'tenant_id': tenantId});
        break;
      case 'customers':
        await LocalDatabase.upsertCustomer({...payload, 'tenant_id': tenantId});
        break;
    }
  }

  static Future<void> fullSync(String tenantId) async {
    await push();
    await pull(tenantId);
  }
}
