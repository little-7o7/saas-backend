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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    dataSource;
    constructor(orderRepo, itemRepo, dataSource) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.dataSource = dataSource;
    }
    findAll(tenantId, status) {
        const qb = this.orderRepo
            .createQueryBuilder('o')
            .leftJoinAndSelect('o.items', 'i')
            .leftJoinAndSelect('i.product', 'p')
            .leftJoinAndSelect('i.variant', 'v')
            .leftJoinAndSelect('o.customer', 'c')
            .where('o.tenant_id = :tenantId', { tenantId })
            .orderBy('o.created_at', 'DESC');
        if (status)
            qb.andWhere('o.status = :status', { status });
        return qb.getMany();
    }
    async findById(tenantId, id) {
        const order = await this.orderRepo.findOne({
            where: { id, tenantId },
            relations: ['items', 'items.product', 'items.variant', 'customer'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async create(tenantId, userId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const totalAmount = dto.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
            const order = queryRunner.manager.create(order_entity_1.Order, {
                tenantId,
                orderNumber: `ORD-${Date.now()}`,
                customerId: dto.customerId,
                status: order_entity_1.OrderStatus.NEW,
                deadlineAt: dto.deadlineAt ? new Date(dto.deadlineAt) : undefined,
                address: dto.address,
                comment: dto.comment,
                totalAmount,
                createdBy: userId,
            });
            await queryRunner.manager.save(order);
            for (const item of dto.items) {
                const orderItem = queryRunner.manager.create(order_item_entity_1.OrderItem, {
                    tenantId,
                    orderId: order.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                });
                await queryRunner.manager.save(orderItem);
            }
            await queryRunner.commitTransaction();
            return this.findById(tenantId, order.id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(tenantId, id, status) {
        const order = await this.findById(tenantId, id);
        order.status = status;
        return this.orderRepo.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map