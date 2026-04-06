import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  DONE = 'done',
  CANCELED = 'canceled',
}

@Entity('orders')
@Index(['tenantId', 'status'])
export class Order extends BaseEntity {
  @Column({ name: 'order_number', unique: false })
  orderNumber: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  status: OrderStatus;

  @Column({ name: 'deadline_at', type: 'timestamptz', nullable: true })
  deadlineAt: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', default: 0 })
  totalAmount: number;

  @Column({ name: 'created_by' })
  createdBy: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
