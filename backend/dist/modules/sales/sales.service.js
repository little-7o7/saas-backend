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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const sale_item_entity_1 = require("./sale-item.entity");
const warehouse_stock_entity_1 = require("../warehouses/warehouse-stock.entity");
const customer_entity_1 = require("../customers/customer.entity");
const debt_entity_1 = require("../debts/debt.entity");
const invoices_service_1 = require("../invoices/invoices.service");
const notifications_service_1 = require("../notifications/notifications.service");
const sms_service_1 = require("../notifications/sms.service");
const tenant_entity_1 = require("../tenants/tenant.entity");
let SalesService = class SalesService {
    saleRepo;
    saleItemRepo;
    stockRepo;
    customerRepo;
    debtRepo;
    tenantRepo;
    invoicesService;
    notificationsService;
    smsService;
    dataSource;
    constructor(saleRepo, saleItemRepo, stockRepo, customerRepo, debtRepo, tenantRepo, invoicesService, notificationsService, smsService, dataSource) {
        this.saleRepo = saleRepo;
        this.saleItemRepo = saleItemRepo;
        this.stockRepo = stockRepo;
        this.customerRepo = customerRepo;
        this.debtRepo = debtRepo;
        this.tenantRepo = tenantRepo;
        this.invoicesService = invoicesService;
        this.notificationsService = notificationsService;
        this.smsService = smsService;
        this.dataSource = dataSource;
    }
    async create(tenantId, userId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const totalAmount = dto.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
            const paidAmount = Math.min(dto.paidAmount, totalAmount);
            const debtAmount = totalAmount - paidAmount;
            const sale = queryRunner.manager.create(sale_entity_1.Sale, {
                tenantId,
                saleNumber: `S-${Date.now()}`,
                customerId: dto.customerId,
                totalAmount,
                paidAmount,
                debtAmount,
                paymentType: dto.paymentType,
                comment: dto.comment,
                warehouseId: dto.warehouseId,
                createdBy: userId,
            });
            await queryRunner.manager.save(sale);
            for (const item of dto.items) {
                const saleItem = queryRunner.manager.create(sale_item_entity_1.SaleItem, {
                    tenantId,
                    saleId: sale.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.quantity * item.unitPrice,
                });
                await queryRunner.manager.save(saleItem);
                if (item.variantId && item.warehouseId) {
                    const stock = await queryRunner.manager.findOne(warehouse_stock_entity_1.WarehouseStock, {
                        where: {
                            tenantId,
                            warehouseId: item.warehouseId,
                            variantId: item.variantId,
                        },
                    });
                    if (stock) {
                        stock.quantity = Number(stock.quantity) - item.quantity;
                        await queryRunner.manager.save(stock);
                    }
                }
            }
            if (debtAmount > 0 && dto.customerId) {
                const customer = await queryRunner.manager.findOne(customer_entity_1.Customer, {
                    where: { id: dto.customerId, tenantId },
                });
                if (customer) {
                    const debt = queryRunner.manager.create(debt_entity_1.Debt, {
                        tenantId,
                        customerId: dto.customerId,
                        saleId: sale.id,
                        originalAmount: debtAmount,
                        remainingAmount: debtAmount,
                        status: debt_entity_1.DebtStatus.OPEN,
                    });
                    await queryRunner.manager.save(debt);
                    customer.totalDebt = Number(customer.totalDebt) + debtAmount;
                    if (Number(customer.creditLimit) > 0 && Number(customer.totalDebt) > Number(customer.creditLimit)) {
                    }
                    await queryRunner.manager.save(customer);
                }
            }
            await queryRunner.commitTransaction();
            const fullSale = await this.saleRepo.findOne({
                where: { id: sale.id },
                relations: ['items', 'items.product', 'items.variant', 'customer'],
            });
            const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
            const customer = dto.customerId
                ? await this.customerRepo.findOne({ where: { id: dto.customerId, tenantId } })
                : null;
            await this.invoicesService.create({
                tenantId,
                saleId: sale.id,
                customerId: dto.customerId,
                customerName: customer?.name,
                totalAmount,
                paidAmount,
                items: fullSale?.items ?? [],
                storeName: tenant?.name ?? '',
                storePhone: tenant?.phone ?? '',
                customerPhone: customer?.phone,
                customerTelegramId: customer?.telegramChatId,
            });
            return fullSale;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(tenantId, from, to) {
        const qb = this.saleRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.items', 'i')
            .leftJoinAndSelect('i.product', 'p')
            .leftJoinAndSelect('i.variant', 'v')
            .leftJoinAndSelect('s.customer', 'c')
            .where('s.tenant_id = :tenantId', { tenantId })
            .orderBy('s.created_at', 'DESC');
        if (from)
            qb.andWhere('s.created_at >= :from', { from });
        if (to)
            qb.andWhere('s.created_at <= :to', { to });
        return qb.getMany();
    }
    async findById(tenantId, id) {
        const sale = await this.saleRepo.findOne({
            where: { id, tenantId },
            relations: ['items', 'items.product', 'items.variant', 'customer'],
        });
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        return sale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_item_entity_1.SaleItem)),
    __param(2, (0, typeorm_1.InjectRepository)(warehouse_stock_entity_1.WarehouseStock)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(debt_entity_1.Debt)),
    __param(5, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoices_service_1.InvoicesService,
        notifications_service_1.NotificationsService,
        sms_service_1.SmsService,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map