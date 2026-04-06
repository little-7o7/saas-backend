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
exports.EmployeeWorkday = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const employee_entity_1 = require("./employee.entity");
let EmployeeWorkday = class EmployeeWorkday extends base_entity_1.BaseEntity {
    employeeId;
    employee;
    workDate;
    hoursWorked;
    rateForDay;
    note;
};
exports.EmployeeWorkday = EmployeeWorkday;
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], EmployeeWorkday.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeWorkday.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_date', type: 'date' }),
    __metadata("design:type", String)
], EmployeeWorkday.prototype, "workDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'hours_worked', default: 8 }),
    __metadata("design:type", Number)
], EmployeeWorkday.prototype, "hoursWorked", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'rate_for_day' }),
    __metadata("design:type", Number)
], EmployeeWorkday.prototype, "rateForDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeWorkday.prototype, "note", void 0);
exports.EmployeeWorkday = EmployeeWorkday = __decorate([
    (0, typeorm_1.Entity)('employee_workdays'),
    (0, typeorm_1.Index)(['tenantId', 'employeeId', 'workDate'], { unique: true })
], EmployeeWorkday);
//# sourceMappingURL=employee-workday.entity.js.map