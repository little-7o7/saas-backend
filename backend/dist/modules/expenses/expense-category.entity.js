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
exports.ExpenseCategory = exports.ExpensePeriod = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
var ExpensePeriod;
(function (ExpensePeriod) {
    ExpensePeriod["DAILY"] = "daily";
    ExpensePeriod["MONTHLY"] = "monthly";
    ExpensePeriod["ONE_TIME"] = "one_time";
})(ExpensePeriod || (exports.ExpensePeriod = ExpensePeriod = {}));
let ExpenseCategory = class ExpenseCategory extends base_entity_1.BaseEntity {
    name;
    isRecurring;
    period;
};
exports.ExpenseCategory = ExpenseCategory;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_recurring', default: false }),
    __metadata("design:type", Boolean)
], ExpenseCategory.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ExpensePeriod, default: ExpensePeriod.ONE_TIME }),
    __metadata("design:type", String)
], ExpenseCategory.prototype, "period", void 0);
exports.ExpenseCategory = ExpenseCategory = __decorate([
    (0, typeorm_1.Entity)('expense_categories')
], ExpenseCategory);
//# sourceMappingURL=expense-category.entity.js.map