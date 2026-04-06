import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';

@Entity('product_variants')
@Index(['tenantId', 'sku'], { unique: true })
export class ProductVariant extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ unique: false })
  sku: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
