import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Warehouse } from './warehouse.entity';
import { ProductVariant } from '../products/product-variant.entity';

@Entity('warehouse_stock')
@Index(['tenantId', 'warehouseId', 'variantId'], { unique: true })
export class WarehouseStock extends BaseEntity {
  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'variant_id' })
  variantId: string;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  quantity: number;

  @Column({ name: 'min_quantity', type: 'decimal', precision: 12, scale: 3, default: 0 })
  minQuantity: number;
}
