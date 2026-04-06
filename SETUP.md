# SaaS Shop — Setup Guide

## Требования
- macOS + Homebrew
- Node.js 18+
- (опционально) Docker Desktop

---

## Быстрый старт (Homebrew)

```bash
# 1. Установить PostgreSQL
brew install postgresql@15

# 2. Запустить БД и создать пользователя
make up

# 3. Заполнить начальными данными
make seed

# 4. Запустить backend
make backend-dev
```

Backend будет доступен на: **http://localhost:3000/api/v1**

---

## Быстрый старт (Docker)

> Установите Docker Desktop: https://www.docker.com/products/docker-desktop/

```bash
docker compose up -d
make seed
make backend-dev
```

---

## Структура проекта

```
saas/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── modules/  # Все модули
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── debts/
│   │   │   ├── invoices/
│   │   │   ├── employees/
│   │   │   ├── expenses/
│   │   │   ├── black-cash/
│   │   │   ├── analytics/
│   │   │   ├── sync/         # Offline sync
│   │   │   └── admin/
│   │   └── common/
│   └── .env
├── frontend/         # Flutter app
│   └── lib/
│       ├── core/
│       │   ├── api/          # Dio HTTP client
│       │   ├── db/           # SQLite (offline)
│       │   └── sync/         # Sync manager
│       └── features/
├── docker-compose.yml
├── Makefile
└── SETUP.md
```

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /auth/register | Регистрация магазина |
| POST | /auth/login | Вход |
| GET | /auth/me | Текущий пользователь |
| POST | /auth/employees | Добавить сотрудника |

### Товары
| Method | URL | Description |
|--------|-----|-------------|
| GET | /products | Список товаров |
| POST | /products | Создать товар |
| PUT | /products/:id | Обновить |
| DELETE | /products/:id | Удалить (soft) |
| POST | /products/:id/variants | Добавить вариант |

### Продажи
| Method | URL | Description |
|--------|-----|-------------|
| GET | /sales | Список продаж |
| POST | /sales | Создать продажу (+ инвойс + долг) |

### Долги
| Method | URL | Description |
|--------|-----|-------------|
| GET | /debts | Список долгов |
| POST | /debts/:id/pay | Оплатить долг |
| POST | /debts/send-reminders | Отправить SMS всем должникам |

### Аналитика
| Method | URL | Description |
|--------|-----|-------------|
| GET | /analytics/dashboard | Дашборд |
| GET | /analytics/sales-by-color | Продажи по цветам |
| GET | /analytics/sales-by-grade | Продажи по сортам |
| GET | /analytics/stock-by-color | Остатки по цветам |

### Накладные (публичные)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /invoices/public/:number | Просмотр накладной (без авторизации) |

### Sync (offline)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /sync/push | Отправить локальные изменения |
| GET | /sync/pull | Получить изменения с сервера |

### Админ
| Method | URL | Description |
|--------|-----|-------------|
| GET | /admin/stats | Статистика системы |
| GET | /admin/tenants | Все магазины |
| POST | /admin/tenants/:id/block | Заблокировать |

---

## .env

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=saas_user
DB_PASSWORD=saas_password
DB_NAME=saas_db

JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

SMS_EMAIL=your@eskiz.uz
SMS_PASSWORD=your_password
SMS_FROM=4546

TELEGRAM_BOT_TOKEN=your_bot_token

INVOICE_BASE_URL=https://yourapp.com/invoice
```

---

## Deploy (PM2)

```bash
make build
pm2 start dist/main.js --name saas-backend
pm2 save
pm2 startup
```

---

## Backup

```bash
make backup      # Создать бэкап
make restore     # Восстановить
```
