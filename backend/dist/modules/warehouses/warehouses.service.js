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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_stock_entity_1 = require("./warehouse-stock.entity");
let WarehousesService = class WarehousesService {
    warehouseRepo;
    stockRepo;
    constructor(warehouseRepo, stockRepo) {
        this.warehouseRepo = warehouseRepo;
        this.stockRepo = stockRepo;
    }
    findAll(tenantId) {
        return this.warehouseRepo.find({ where: { tenantId, isActive: true } });
    }
    create(tenantId, dto) {
        const w = this.warehouseRepo.create({ ...dto, tenantId });
        return this.warehouseRepo.save(w);
    }
    async getStock(tenantId, warehouseId) {
        const qb = this.stockRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.variant', 'v')
            .leftJoinAndSelect('v.product', 'p')
            .leftJoinAndSelect('s.warehouse', 'w')
            .where('s.tenant_id = :tenantId', { tenantId });
        if (warehouseId)
            qb.andWhere('s.warehouse_id = :warehouseId', { warehouseId });
        return qb.orderBy('p.name', 'ASC').getMany();
    }
    async updateStock(tenantId, warehouseId, variantId, quantity) {
        let stock = await this.stockRepo.findOne({
            where: { tenantId, warehouseId, variantId },
        });
        if (!stock) {
            stock = this.stockRepo.create({ tenantId, warehouseId, variantId, quantity: 0 });
        }
        stock.quantity = Number(stock.quantity) + quantity;
        return this.stockRepo.save(stock);
    }
    async receiveStock(tenantId, dto) {
        const results = [];
        for (const item of dto.items) {
            const stock = await this.updateStock(tenantId, dto.warehouseId, item.variantId, item.quantity);
            results.push(stock);
        }
        return results;
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(1, (0, typeorm_1.InjectRepository)(warehouse_stock_entity_1.WarehouseStock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map