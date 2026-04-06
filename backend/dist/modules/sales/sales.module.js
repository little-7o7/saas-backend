"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sale_entity_1 = require("./sale.entity");
const sale_item_entity_1 = require("./sale-item.entity");
const warehouse_stock_entity_1 = require("../warehouses/warehouse-stock.entity");
const customer_entity_1 = require("../customers/customer.entity");
const debt_entity_1 = require("../debts/debt.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const sales_controller_1 = require("./sales.controller");
const sales_service_1 = require("./sales.service");
const invoices_module_1 = require("../invoices/invoices.module");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sale_entity_1.Sale, sale_item_entity_1.SaleItem, warehouse_stock_entity_1.WarehouseStock, customer_entity_1.Customer, debt_entity_1.Debt, tenant_entity_1.Tenant]),
            invoices_module_1.InvoicesModule,
        ],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
        exports: [sales_service_1.SalesService],
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map