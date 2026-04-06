"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_config_1 = require("./database/database.config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const auth_module_1 = require("./modules/auth/auth.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const products_module_1 = require("./modules/products/products.module");
const categories_module_1 = require("./modules/categories/categories.module");
const warehouses_module_1 = require("./modules/warehouses/warehouses.module");
const customers_module_1 = require("./modules/customers/customers.module");
const orders_module_1 = require("./modules/orders/orders.module");
const sales_module_1 = require("./modules/sales/sales.module");
const debts_module_1 = require("./modules/debts/debts.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const employees_module_1 = require("./modules/employees/employees.module");
const expenses_module_1 = require("./modules/expenses/expenses.module");
const black_cash_module_1 = require("./modules/black-cash/black-cash.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const sync_module_1 = require("./modules/sync/sync.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: database_config_1.getDatabaseConfig,
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            warehouses_module_1.WarehousesModule,
            customers_module_1.CustomersModule,
            orders_module_1.OrdersModule,
            invoices_module_1.InvoicesModule,
            sales_module_1.SalesModule,
            debts_module_1.DebtsModule,
            employees_module_1.EmployeesModule,
            expenses_module_1.ExpensesModule,
            black_cash_module_1.BlackCashModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            sync_module_1.SyncModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map