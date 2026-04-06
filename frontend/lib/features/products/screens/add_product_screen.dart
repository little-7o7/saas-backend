import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/api/api_client.dart';
import '../../../shared/providers/api_providers.dart';

class AddProductScreen extends ConsumerStatefulWidget {
  const AddProductScreen({super.key});
  @override
  ConsumerState<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends ConsumerState<AddProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _skuCtrl = TextEditingController();
  final _purchaseCtrl = TextEditingController();
  final _wholesaleCtrl = TextEditingController();
  final _retailCtrl = TextEditingController();
  String _unit = 'piece';
  String? _categoryId;
  bool _loading = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _skuCtrl.dispose();
    _purchaseCtrl.dispose();
    _wholesaleCtrl.dispose();
    _retailCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      final dio = await ApiClient.instance;
      await dio.post('/products', data: {
        'name': _nameCtrl.text.trim(),
        if (_skuCtrl.text.isNotEmpty) 'sku': _skuCtrl.text.trim(),
        'purchasePrice': double.parse(_purchaseCtrl.text.replaceAll(' ', '')),
        'wholesalePrice': double.parse(_wholesaleCtrl.text.replaceAll(' ', '')),
        'retailPrice': double.parse(_retailCtrl.text.replaceAll(' ', '')),
        'unit': _unit,
        if (_categoryId != null) 'categoryId': _categoryId,
      });
      ref.invalidate(productsProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Товар добавлен'), backgroundColor: Colors.green),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Новый товар'),
        actions: [
          TextButton(
            onPressed: _loading ? null : _save,
            child: const Text('Сохранить',
                style: TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _field(_nameCtrl, 'Название товара *', required: true),
            const SizedBox(height: 12),
            _field(_skuCtrl, 'Артикул (SKU)', hint: 'Автоматически если пусто'),
            const SizedBox(height: 12),
            // Unit selector
            DropdownButtonFormField<String>(
              value: _unit,
              decoration: _decor('Единица измерения'),
              items: const [
                DropdownMenuItem(value: 'piece', child: Text('Штука')),
                DropdownMenuItem(value: 'meter', child: Text('Метр')),
                DropdownMenuItem(value: 'kg', child: Text('Килограмм')),
                DropdownMenuItem(value: 'liter', child: Text('Литр')),
                DropdownMenuItem(value: 'box', child: Text('Коробка')),
              ],
              onChanged: (v) => setState(() => _unit = v!),
            ),
            const SizedBox(height: 16),
            const Text('Цены', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 8),
            _priceField(_purchaseCtrl, 'Закупочная цена *'),
            const SizedBox(height: 12),
            _priceField(_wholesaleCtrl, 'Оптовая цена *'),
            const SizedBox(height: 12),
            _priceField(_retailCtrl, 'Розничная цена *'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _loading ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    : const Text('Добавить товар', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(TextEditingController ctrl, String label,
      {String? hint, bool required = false}) {
    return TextFormField(
      controller: ctrl,
      decoration: _decor(label, hint: hint),
      validator: required ? (v) => (v?.isEmpty ?? true) ? 'Обязательное поле' : null : null,
    );
  }

  Widget _priceField(TextEditingController ctrl, String label) {
    return TextFormField(
      controller: ctrl,
      keyboardType: TextInputType.number,
      decoration: _decor(label, suffix: 'UZS'),
      validator: (v) {
        if (v == null || v.isEmpty) return 'Обязательное поле';
        if (double.tryParse(v.replaceAll(' ', '')) == null) return 'Введите число';
        return null;
      },
    );
  }

  InputDecoration _decor(String label, {String? hint, String? suffix}) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      suffixText: suffix,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
    );
  }
}
