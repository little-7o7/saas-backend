"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseStock = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const warehouse_entity_1 = require("./warehouse.entity");
const product_variant_entity_1 = require("../products/product-variant.entity");
let WarehouseStock = class WarehouseStock extends base_entity_1.BaseEntity {
    warehouseId;
    warehouse;
    variantId;
    variant;
    quantity;
    minQuantity;
};
exports.WarehouseStock = WarehouseStock;
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], WarehouseStock.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseStock.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id' }),
    __metadata("design:type", String)
], WarehouseStock.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], WarehouseStock.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], WarehouseStock.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_quantity', type: 'decimal', precision: 12, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], WarehouseStock.prototype, "minQuantity", void 0);
exports.WarehouseStock = WarehouseStock = __decorate([
    (0, typeorm_1.Entity)('warehouse_stock'),
    (0, typeorm_1.Index)(['tenantId', 'warehouseId', 'variantId'], { unique: true })
], WarehouseStock);
//# sourceMappingURL=warehouse-stock.entity.js.map