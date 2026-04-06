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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const employee_workday_entity_1 = require("./employee-workday.entity");
const employee_advance_entity_1 = require("./employee-advance.entity");
let EmployeesService = class EmployeesService {
    empRepo;
    workdayRepo;
    advanceRepo;
    constructor(empRepo, workdayRepo, advanceRepo) {
        this.empRepo = empRepo;
        this.workdayRepo = workdayRepo;
        this.advanceRepo = advanceRepo;
    }
    findAll(tenantId) {
        return this.empRepo.find({ where: { tenantId, isActive: true } });
    }
    async findById(tenantId, id) {
        const emp = await this.empRepo.findOne({ where: { id, tenantId } });
        if (!emp)
            throw new common_1.NotFoundException('Employee not found');
        return emp;
    }
    create(tenantId, dto) {
        const emp = this.empRepo.create({ ...dto, tenantId });
        return this.empRepo.save(emp);
    }
    async update(tenantId, id, dto) {
        const emp = await this.findById(tenantId, id);
        Object.assign(emp, dto);
        return this.empRepo.save(emp);
    }
    async addWorkday(tenantId, employeeId, dto) {
        const emp = await this.findById(tenantId, employeeId);
        const workday = this.workdayRepo.create({
            tenantId,
            employeeId,
            workDate: dto.workDate,
            hoursWorked: dto.hoursWorked ?? 8,
            rateForDay: dto.rateForDay ?? emp.dailyRate,
            note: dto.note,
        });
        return this.workdayRepo.save(workday);
    }
    async addAdvance(tenantId, employeeId, dto) {
        await this.findById(tenantId, employeeId);
        const advance = this.advanceRepo.create({
            tenantId,
            employeeId,
            ...dto,
        });
        return this.advanceRepo.save(advance);
    }
    async getSalaryReport(tenantId, employeeId, from, to) {
        const emp = await this.findById(tenantId, employeeId);
        const workdays = await this.workdayRepo
            .createQueryBuilder('w')
            .where('w.tenant_id = :tenantId AND w.employee_id = :employeeId', { tenantId, employeeId })
            .andWhere('w.work_date BETWEEN :from AND :to', { from, to })
            .getMany();
        const advances = await this.advanceRepo
            .createQueryBuilder('a')
            .where('a.tenant_id = :tenantId AND a.employee_id = :employeeId', { tenantId, employeeId })
            .andWhere('a.advance_date BETWEEN :from AND :to', { from, to })
            .getMany();
        const totalEarned = workdays.reduce((sum, w) => sum + Number(w.rateForDay), 0);
        const totalAdvances = advances.reduce((sum, a) => sum + Number(a.amount), 0);
        const netSalary = totalEarned - totalAdvances;
        return {
            employee: emp,
            workdays,
            advances,
            totalEarned,
            totalAdvances,
            netSalary,
            period: { from, to },
        };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_workday_entity_1.EmployeeWorkday)),
    __param(2, (0, typeorm_1.InjectRepository)(employee_advance_entity_1.EmployeeAdvance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map