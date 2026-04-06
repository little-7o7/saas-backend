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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const uuid_1 = require("uuid");
let ProductsService = class ProductsService {
    productRepo;
    variantRepo;
    dataSource;
    constructor(productRepo, variantRepo, dataSource) {
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.dataSource = dataSource;
    }
    async create(tenantId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const sku = dto.sku || `SKU-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
            const product = queryRunner.manager.create(product_entity_1.Product, {
                tenantId,
                name: dto.name,
                sku,
                categoryId: dto.categoryId,
                unit: dto.unit,
                purchasePrice: dto.purchasePrice,
                wholesalePrice: dto.wholesalePrice,
                retailPrice: dto.retailPrice,
                description: dto.description,
            });
            await queryRunner.manager.save(product);
            if (dto.variants?.length) {
                for (const v of dto.variants) {
                    const variant = queryRunner.manager.create(product_variant_entity_1.ProductVariant, {
                        tenantId,
                        productId: product.id,
                        color: v.color,
                        grade: v.grade,
                        sku: v.sku || `${sku}-${(0, uuid_1.v4)().substring(0, 4).toUpperCase()}`,
                    });
                    await queryRunner.manager.save(variant);
                }
            }
            await queryRunner.commitTransaction();
            return this.findById(tenantId, product.id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(tenantId, search) {
        const qb = this.productRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.variants', 'v')
            .leftJoinAndSelect('p.category', 'c')
            .where('p.tenant_id = :tenantId', { tenantId })
            .andWhere('p.is_active = true');
        if (search) {
            qb.andWhere('(p.name ILIKE :s OR p.sku ILIKE :s)', { s: `%${search}%` });
        }
        return qb.orderBy('p.name', 'ASC').getMany();
    }
    async findById(tenantId, id) {
        const product = await this.productRepo.findOne({
            where: { id, tenantId },
            relations: ['variants', 'category'],
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(tenantId, id, dto) {
        const product = await this.findById(tenantId, id);
        Object.assign(product, dto);
        await this.productRepo.save(product);
        return this.findById(tenantId, id);
    }
    async delete(tenantId, id) {
        const product = await this.findById(tenantId, id);
        product.isActive = false;
        await this.productRepo.save(product);
    }
    async addVariant(tenantId, productId, dto) {
        const product = await this.findById(tenantId, productId);
        const variant = this.variantRepo.create({
            tenantId,
            productId: product.id,
            color: dto.color,
            grade: dto.grade,
            sku: dto.sku || `${product.sku}-${(0, uuid_1.v4)().substring(0, 4).toUpperCase()}`,
        });
        return this.variantRepo.save(variant);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map