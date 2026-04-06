import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Debt } from './debt.entity';

@Entity('debt_payments')
export class DebtPayment extends BaseEntity {
  @Column({ name: 'debt_id' })
  debtId: string;

  @ManyToOne(() => Debt)
  @JoinColumn({ name: 'debt_id' })
  debt: Debt;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'created_by' })
  createdBy: string;
}
