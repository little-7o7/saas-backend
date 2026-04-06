import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';

export enum DebtStatus {
  OPEN = 'open',
  PARTIAL = 'partial',
  PAID = 'paid',
}

@Entity('debts')
@Index(['tenantId', 'customerId', 'status'])
export class Debt extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'sale_id', nullable: true })
  saleId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'original_amount' })
  originalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'remaining_amount' })
  remainingAmount: number;

  @Column({ type: 'enum', enum: DebtStatus, default: DebtStatus.OPEN })
  status: DebtStatus;

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'last_reminder_at', type: 'timestamptz', nullable: true })
  lastReminderAt: Date;
}
