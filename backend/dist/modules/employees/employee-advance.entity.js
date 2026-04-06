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
exports.EmployeeAdvance = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const employee_entity_1 = require("./employee.entity");
let EmployeeAdvance = class EmployeeAdvance extends base_entity_1.BaseEntity {
    employeeId;
    employee;
    amount;
    advanceDate;
    comment;
    createdBy;
};
exports.EmployeeAdvance = EmployeeAdvance;
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], EmployeeAdvance.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeAdvance.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], EmployeeAdvance.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'advance_date' }),
    __metadata("design:type", String)
], EmployeeAdvance.prototype, "advanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeAdvance.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], EmployeeAdvance.prototype, "createdBy", void 0);
exports.EmployeeAdvance = EmployeeAdvance = __decorate([
    (0, typeorm_1.Entity)('employee_advances')
], EmployeeAdvance);
//# sourceMappingURL=employee-advance.entity.js.map