import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../categories/category.entity';
import { ProductVariant } from './product-variant.entity';

export enum UnitType {
  PIECE = 'piece',
  METER = 'meter',
  KG = 'kg',
  LITER = 'liter',
}

@Entity('products')
@Index(['tenantId', 'sku'], { unique: true })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: false })
  sku: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({
    type: 'enum',
    enum: UnitType,
    default: UnitType.PIECE,
  })
  unit: UnitType;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'purchase_price', default: 0 })
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'wholesale_price', default: 0 })
  wholesalePrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'retail_price', default: 0 })
  retailPrice: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  variants: ProductVariant[];
}
