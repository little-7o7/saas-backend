import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ExpenseCategory } from './expense-category.entity';

@Entity('expenses')
@Index(['tenantId', 'createdAt'])
export class Expense extends BaseEntity {
  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => ExpenseCategory)
  @JoinColumn({ name: 'category_id' })
  category: ExpenseCategory;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date', name: 'expense_date' })
  expenseDate: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'is_auto', default: false })
  isAuto: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;
}
