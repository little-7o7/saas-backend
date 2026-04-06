import 'package:intl/intl.dart';

String formatMoney(dynamic amount) {
  final num value = num.tryParse(amount.toString()) ?? 0;
  return NumberFormat('#,###', 'ru_RU').format(value) + ' UZS';
}

String formatDate(String? isoDate) {
  if (isoDate == null) return '—';
  try {
    final dt = DateTime.parse(isoDate).toLocal();
    return DateFormat('dd.MM.yyyy').format(dt);
  } catch (_) {
    return isoDate;
  }
}

String formatDateTime(String? isoDate) {
  if (isoDate == null) return '—';
  try {
    final dt = DateTime.parse(isoDate).toLocal();
    return DateFormat('dd.MM.yyyy HH:mm').format(dt);
  } catch (_) {
    return isoDate;
  }
}

String todayStr() => DateFormat('yyyy-MM-dd').format(DateTime.now());
String monthStartStr() {
  final now = DateTime.now();
  return DateFormat('yyyy-MM-dd').format(DateTime(now.year, now.month, 1));
}
