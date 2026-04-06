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
exports.BlackCashTransaction = exports.BlackCashPeriod = exports.BlackCashType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
var BlackCashType;
(function (BlackCashType) {
    BlackCashType["DEPOSIT"] = "deposit";
    BlackCashType["WITHDRAWAL"] = "withdrawal";
    BlackCashType["PROFIT"] = "profit";
})(BlackCashType || (exports.BlackCashType = BlackCashType = {}));
var BlackCashPeriod;
(function (BlackCashPeriod) {
    BlackCashPeriod["WEEKLY"] = "weekly";
    BlackCashPeriod["MONTHLY"] = "monthly";
    BlackCashPeriod["ONE_TIME"] = "one_time";
})(BlackCashPeriod || (exports.BlackCashPeriod = BlackCashPeriod = {}));
let BlackCashTransaction = class BlackCashTransaction extends base_entity_1.BaseEntity {
    type;
    amount;
    period;
    description;
    createdBy;
};
exports.BlackCashTransaction = BlackCashTransaction;
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BlackCashType }),
    __metadata("design:type", String)
], BlackCashTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], BlackCashTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BlackCashPeriod, default: BlackCashPeriod.ONE_TIME }),
    __metadata("design:type", String)
], BlackCashTransaction.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlackCashTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], BlackCashTransaction.prototype, "createdBy", void 0);
exports.BlackCashTransaction = BlackCashTransaction = __decorate([
    (0, typeorm_1.Entity)('black_cash_transactions'),
    (0, typeorm_1.Index)(['tenantId', 'createdAt'])
], BlackCashTransaction);
//# sourceMappingURL=black-cash.entity.js.map