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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./expense.entity");
const expense_category_entity_1 = require("./expense-category.entity");
let ExpensesService = class ExpensesService {
    expenseRepo;
    categoryRepo;
    constructor(expenseRepo, categoryRepo) {
        this.expenseRepo = expenseRepo;
        this.categoryRepo = categoryRepo;
    }
    findAllCategories(tenantId) {
        return this.categoryRepo.find({ where: { tenantId } });
    }
    createCategory(tenantId, dto) {
        const cat = this.categoryRepo.create({ ...dto, tenantId });
        return this.categoryRepo.save(cat);
    }
    findAll(tenantId, from, to) {
        const qb = this.expenseRepo
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.category', 'c')
            .where('e.tenant_id = :tenantId', { tenantId })
            .orderBy('e.expense_date', 'DESC');
        if (from)
            qb.andWhere('e.expense_date >= :from', { from });
        if (to)
            qb.andWhere('e.expense_date <= :to', { to });
        return qb.getMany();
    }
    create(tenantId, dto) {
        const expense = this.expenseRepo.create({ ...dto, tenantId });
        return this.expenseRepo.save(expense);
    }
    async autoCreateRecurring(tenantId) {
        const recurringCategories = await this.categoryRepo.find({
            where: { tenantId, isRecurring: true },
        });
        const today = new Date().toISOString().split('T')[0];
        const created = [];
        for (const cat of recurringCategories) {
            const existing = await this.expenseRepo.findOne({
                where: { tenantId, categoryId: cat.id, expenseDate: today },
            });
            if (existing)
                continue;
            const expense = this.expenseRepo.create({
                tenantId,
                categoryId: cat.id,
                name: cat.name,
                amount: 0,
                expenseDate: today,
                isAuto: true,
                createdBy: 'system',
            });
            created.push(await this.expenseRepo.save(expense));
        }
        return created;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map