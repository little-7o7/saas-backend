import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';
import { SaleItem } from './sale-item.entity';

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  MIXED = 'mixed',
}

@Entity('sales')
@Index(['tenantId', 'createdAt'])
export class Sale extends BaseEntity {
  @Column({ name: 'sale_number', unique: false })
  saleNumber: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'paid_amount', default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'debt_amount', default: 0 })
  debtAmount: number;

  @Column({ type: 'enum', enum: PaymentType, name: 'payment_type', default: PaymentType.CASH })
  paymentType: PaymentType;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];
}
