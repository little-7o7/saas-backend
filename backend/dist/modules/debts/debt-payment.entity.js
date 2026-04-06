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
exports.DebtPayment = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const debt_entity_1 = require("./debt.entity");
let DebtPayment = class DebtPayment extends base_entity_1.BaseEntity {
    debtId;
    debt;
    amount;
    comment;
    createdBy;
};
exports.DebtPayment = DebtPayment;
__decorate([
    (0, typeorm_1.Column)({ name: 'debt_id' }),
    __metadata("design:type", String)
], DebtPayment.prototype, "debtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => debt_entity_1.Debt),
    (0, typeorm_1.JoinColumn)({ name: 'debt_id' }),
    __metadata("design:type", debt_entity_1.Debt)
], DebtPayment.prototype, "debt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], DebtPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DebtPayment.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], DebtPayment.prototype, "createdBy", void 0);
exports.DebtPayment = DebtPayment = __decorate([
    (0, typeorm_1.Entity)('debt_payments')
], DebtPayment);
//# sourceMappingURL=debt-payment.entity.js.map