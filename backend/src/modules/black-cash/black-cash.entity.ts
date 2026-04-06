import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum BlackCashType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PROFIT = 'profit',
}

export enum BlackCashPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
}

@Entity('black_cash_transactions')
@Index(['tenantId', 'createdAt'])
export class BlackCashTransaction extends BaseEntity {
  @Column({ type: 'enum', enum: BlackCashType })
  type: BlackCashType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: BlackCashPeriod, default: BlackCashPeriod.ONE_TIME })
  period: BlackCashPeriod;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_by' })
  createdBy: string;
}
