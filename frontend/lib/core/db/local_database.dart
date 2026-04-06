import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class LocalDatabase {
  static Database? _db;

  static Future<Database> get instance async {
    _db ??= await _init();
    return _db!;
  }

  static Future<Database> _init() async {
    final path = join(await getDatabasesPath(), 'saas_shop.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  static Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE products (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sku TEXT,
        category_id TEXT,
        unit TEXT,
        purchase_price REAL,
        wholesale_price REAL,
        retail_price REAL,
        is_active INTEGER DEFAULT 1,
        synced_at TEXT,
        updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE product_variants (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        color TEXT,
        grade TEXT,
        sku TEXT,
        is_active INTEGER DEFAULT 1,
        synced_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE customers (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        credit_limit REAL DEFAULT 0,
        total_debt REAL DEFAULT 0,
        synced_at TEXT,
        updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE sales (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        sale_number TEXT,
        customer_id TEXT,
        total_amount REAL,
        paid_amount REAL,
        debt_amount REAL,
        payment_type TEXT,
        comment TEXT,
        created_by TEXT,
        created_at TEXT,
        synced INTEGER DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE sale_items (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        sale_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        variant_id TEXT,
        quantity REAL,
        unit_price REAL,
        total_price REAL
      )
    ''');

    await db.execute('''
      CREATE TABLE sync_queue (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        payload TEXT NOT NULL,
        client_timestamp TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE warehouse_stock (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        warehouse_id TEXT NOT NULL,
        variant_id TEXT NOT NULL,
        quantity REAL DEFAULT 0,
        synced_at TEXT
      )
    ''');
  }

  // Products
  static Future<List<Map<String, dynamic>>> getProducts(String tenantId) async {
    final db = await instance;
    return db.query('products',
        where: 'tenant_id = ? AND is_active = 1', whereArgs: [tenantId]);
  }

  static Future<void> upsertProduct(Map<String, dynamic> data) async {
    final db = await instance;
    await db.insert('products', data, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  // Customers
  static Future<List<Map<String, dynamic>>> getCustomers(String tenantId) async {
    final db = await instance;
    return db.query('customers', where: 'tenant_id = ?', whereArgs: [tenantId]);
  }

  static Future<void> upsertCustomer(Map<String, dynamic> data) async {
    final db = await instance;
    await db.insert('customers', data, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  // Sales
  static Future<String> saveSale(Map<String, dynamic> sale, List<Map<String, dynamic>> items) async {
    final db = await instance;
    await db.insert('sales', sale, conflictAlgorithm: ConflictAlgorithm.replace);
    for (final item in items) {
      await db.insert('sale_items', item, conflictAlgorithm: ConflictAlgorithm.replace);
    }
    return sale['id'] as String;
  }

  static Future<List<Map<String, dynamic>>> getUnsyncedSales() async {
    final db = await instance;
    return db.query('sales', where: 'synced = 0');
  }

  // Sync queue
  static Future<void> addToSyncQueue(Map<String, dynamic> entry) async {
    final db = await instance;
    await db.insert('sync_queue', entry, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  static Future<List<Map<String, dynamic>>> getPendingSync() async {
    final db = await instance;
    return db.query('sync_queue', where: 'synced = 0', orderBy: 'client_timestamp ASC');
  }

  static Future<void> markSynced(String id) async {
    final db = await instance;
    await db.update('sync_queue', {'synced': 1}, where: 'id = ?', whereArgs: [id]);
  }
}
