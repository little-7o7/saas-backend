import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ExpensePeriod {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
}

@Entity('expense_categories')
export class ExpenseCategory extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ type: 'enum', enum: ExpensePeriod, default: ExpensePeriod.ONE_TIME })
  period: ExpensePeriod;
}
