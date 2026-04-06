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
exports.Debt = exports.DebtStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const customer_entity_1 = require("../customers/customer.entity");
var DebtStatus;
(function (DebtStatus) {
    DebtStatus["OPEN"] = "open";
    DebtStatus["PARTIAL"] = "partial";
    DebtStatus["PAID"] = "paid";
})(DebtStatus || (exports.DebtStatus = DebtStatus = {}));
let Debt = class Debt extends base_entity_1.BaseEntity {
    customerId;
    customer;
    saleId;
    originalAmount;
    remainingAmount;
    status;
    dueDate;
    comment;
    lastReminderAt;
};
exports.Debt = Debt;
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], Debt.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Debt.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_id', nullable: true }),
    __metadata("design:type", String)
], Debt.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'original_amount' }),
    __metadata("design:type", Number)
], Debt.prototype, "originalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'remaining_amount' }),
    __metadata("design:type", Number)
], Debt.prototype, "remainingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DebtStatus, default: DebtStatus.OPEN }),
    __metadata("design:type", String)
], Debt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Debt.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Debt.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_reminder_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Debt.prototype, "lastReminderAt", void 0);
exports.Debt = Debt = __decorate([
    (0, typeorm_1.Entity)('debts'),
    (0, typeorm_1.Index)(['tenantId', 'customerId', 'status'])
], Debt);
//# sourceMappingURL=debt.entity.js.map