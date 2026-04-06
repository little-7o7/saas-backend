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
exports.SubscriptionPlan = exports.PlanType = void 0;
const typeorm_1 = require("typeorm");
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    PlanType["BASIC"] = "basic";
    PlanType["PRO"] = "pro";
})(PlanType || (exports.PlanType = PlanType = {}));
let SubscriptionPlan = class SubscriptionPlan {
    id;
    type;
    name;
    price;
    maxProducts;
    maxEmployees;
    maxWarehouses;
    smsEnabled;
    analyticsEnabled;
    isActive;
    createdAt;
    updatedAt;
};
exports.SubscriptionPlan = SubscriptionPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanType, unique: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_products', default: 100 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_employees', default: 3 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxEmployees", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_warehouses', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxWarehouses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_enabled', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "smsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'analytics_enabled', default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "analyticsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "updatedAt", void 0);
exports.SubscriptionPlan = SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)('subscription_plans')
], SubscriptionPlan);
//# sourceMappingURL=subscription-plan.entity.js.map