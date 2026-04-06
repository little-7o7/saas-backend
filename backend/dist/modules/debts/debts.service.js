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
exports.DebtsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const debt_entity_1 = require("./debt.entity");
const debt_payment_entity_1 = require("./debt-payment.entity");
const customer_entity_1 = require("../customers/customer.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const sms_service_1 = require("../notifications/sms.service");
const tenant_entity_1 = require("../tenants/tenant.entity");
let DebtsService = class DebtsService {
    debtRepo;
    paymentRepo;
    customerRepo;
    tenantRepo;
    notificationsService;
    smsService;
    dataSource;
    constructor(debtRepo, paymentRepo, customerRepo, tenantRepo, notificationsService, smsService, dataSource) {
        this.debtRepo = debtRepo;
        this.paymentRepo = paymentRepo;
        this.customerRepo = customerRepo;
        this.tenantRepo = tenantRepo;
        this.notificationsService = notificationsService;
        this.smsService = smsService;
        this.dataSource = dataSource;
    }
    async findAll(tenantId, customerId) {
        const where = { tenantId };
        if (customerId)
            where.customerId = customerId;
        return this.debtRepo.find({
            where,
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findCustomerDebts(tenantId, customerId) {
        return this.debtRepo.find({
            where: { tenantId, customerId },
            order: { createdAt: 'DESC' },
        });
    }
    async payDebt(tenantId, debtId, amount, userId, comment) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const debt = await queryRunner.manager.findOne(debt_entity_1.Debt, {
                where: { id: debtId, tenantId },
                relations: ['customer'],
            });
            if (!debt)
                throw new common_1.NotFoundException('Debt not found');
            const payment = queryRunner.manager.create(debt_payment_entity_1.DebtPayment, {
                tenantId,
                debtId,
                amount,
                comment,
                createdBy: userId,
            });
            await queryRunner.manager.save(payment);
            debt.remainingAmount = Number(debt.remainingAmount) - amount;
            if (debt.remainingAmount <= 0) {
                debt.remainingAmount = 0;
                debt.status = debt_entity_1.DebtStatus.PAID;
            }
            else {
                debt.status = debt_entity_1.DebtStatus.PARTIAL;
            }
            await queryRunner.manager.save(debt);
            const customer = await queryRunner.manager.findOne(customer_entity_1.Customer, {
                where: { id: debt.customerId, tenantId },
            });
            if (customer) {
                customer.totalDebt = Math.max(0, Number(customer.totalDebt) - amount);
                await queryRunner.manager.save(customer);
            }
            await queryRunner.commitTransaction();
            return debt;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async sendReminders(tenantId) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        if (!tenant)
            return { sent: 0, failed: 0 };
        const openDebts = await this.debtRepo.find({
            where: { tenantId, status: debt_entity_1.DebtStatus.OPEN },
            relations: ['customer'],
        });
        let sent = 0;
        let failed = 0;
        for (const debt of openDebts) {
            if (!debt.customer?.phone)
                continue;
            const msg = `${tenant.name}: Sizning qarzingiz ${Number(debt.remainingAmount).toLocaleString()} UZS. Iltimos to'lang.`;
            const ok = await this.notificationsService.sendSms(tenantId, debt.customer.phone, msg, 'debt', debt.id);
            if (ok) {
                debt.lastReminderAt = new Date();
                await this.debtRepo.save(debt);
                sent++;
            }
            else {
                failed++;
            }
        }
        return { sent, failed };
    }
};
exports.DebtsService = DebtsService;
exports.DebtsService = DebtsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(debt_entity_1.Debt)),
    __param(1, (0, typeorm_1.InjectRepository)(debt_payment_entity_1.DebtPayment)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        sms_service_1.SmsService,
        typeorm_2.DataSource])
], DebtsService);
//# sourceMappingURL=debts.service.js.map