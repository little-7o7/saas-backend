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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
let Invoice = class Invoice extends base_entity_1.BaseEntity {
    invoiceNumber;
    saleId;
    customerId;
    customerName;
    totalAmount;
    paidAmount;
    qrCode;
    publicUrl;
    itemsSnapshot;
    smsSent;
    telegramSent;
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_number', unique: false }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_id', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'paid_amount', default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_code', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_url', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "publicUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'items_snapshot', type: 'jsonb' }),
    __metadata("design:type", Object)
], Invoice.prototype, "itemsSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_sent', default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "smsSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'telegram_sent', default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "telegramSent", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)('invoices'),
    (0, typeorm_1.Index)(['tenantId', 'invoiceNumber'], { unique: true })
], Invoice);
//# sourceMappingURL=invoice.entity.js.map