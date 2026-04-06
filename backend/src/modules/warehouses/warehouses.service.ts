import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseStock } from './warehouse-stock.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse) private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(WarehouseStock) private stockRepo: Repository<WarehouseStock>,
  ) {}

  findAll(tenantId: string) {
    return this.warehouseRepo.find({ where: { tenantId, isActive: true } });
  }

  create(tenantId: string, dto: Partial<Warehouse>) {
    const w = this.warehouseRepo.create({ ...dto, tenantId });
    return this.warehouseRepo.save(w);
  }

  async getStock(tenantId: string, warehouseId?: string) {
    const qb = this.stockRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.variant', 'v')
      .leftJoinAndSelect('v.product', 'p')
      .leftJoinAndSelect('s.warehouse', 'w')
      .where('s.tenant_id = :tenantId', { tenantId });

    if (warehouseId) qb.andWhere('s.warehouse_id = :warehouseId', { warehouseId });

    return qb.orderBy('p.name', 'ASC').getMany();
  }

  async updateStock(tenantId: string, warehouseId: string, variantId: string, quantity: number) {
    let stock = await this.stockRepo.findOne({
      where: { tenantId, warehouseId, variantId },
    });

    if (!stock) {
      stock = this.stockRepo.create({ tenantId, warehouseId, variantId, quantity: 0 });
    }
    stock.quantity = Number(stock.quantity) + quantity;
    return this.stockRepo.save(stock);
  }

  async receiveStock(tenantId: string, dto: {
    warehouseId: string;
    items: Array<{ variantId: string; quantity: number }>;
  }) {
    const results: WarehouseStock[] = [];
    for (const item of dto.items) {
      const stock = await this.updateStock(tenantId, dto.warehouseId, item.variantId, item.quantity);
      results.push(stock);
    }
    return results;
  }
}
