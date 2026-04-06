import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateProductDto {
  name: string;
  sku?: string;
  categoryId?: string;
  unit?: string;
  purchasePrice: number;
  wholesalePrice: number;
  retailPrice: number;
  description?: string;
  variants?: Array<{ color?: string; grade?: string; sku?: string }>;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) private variantRepo: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}

  async create(tenantId: string, dto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sku = dto.sku || `SKU-${uuidv4().substring(0, 8).toUpperCase()}`;
      const product = queryRunner.manager.create(Product, {
        tenantId,
        name: dto.name,
        sku,
        categoryId: dto.categoryId,
        unit: dto.unit as any,
        purchasePrice: dto.purchasePrice,
        wholesalePrice: dto.wholesalePrice,
        retailPrice: dto.retailPrice,
        description: dto.description,
      });
      await queryRunner.manager.save(product);

      if (dto.variants?.length) {
        for (const v of dto.variants) {
          const variant = queryRunner.manager.create(ProductVariant, {
            tenantId,
            productId: product.id,
            color: v.color,
            grade: v.grade,
            sku: v.sku || `${sku}-${uuidv4().substring(0, 4).toUpperCase()}`,
          });
          await queryRunner.manager.save(variant);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(tenantId, product.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(tenantId: string, search?: string): Promise<Product[]> {
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

  async findById(tenantId: string, id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, tenantId },
      relations: ['variants', 'category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(tenantId, id);
    Object.assign(product, dto);
    await this.productRepo.save(product);
    return this.findById(tenantId, id);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const product = await this.findById(tenantId, id);
    product.isActive = false;
    await this.productRepo.save(product);
  }

  async addVariant(tenantId: string, productId: string, dto: { color?: string; grade?: string; sku?: string }) {
    const product = await this.findById(tenantId, productId);
    const variant = this.variantRepo.create({
      tenantId,
      productId: product.id,
      color: dto.color,
      grade: dto.grade,
      sku: dto.sku || `${product.sku}-${uuidv4().substring(0, 4).toUpperCase()}`,
    });
    return this.variantRepo.save(variant);
  }
}
