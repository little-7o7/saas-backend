import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('customers')
@Index(['tenantId', 'phone'])
export class Customer extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'credit_limit', default: 0 })
  creditLimit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_debt', default: 0 })
  totalDebt: number;

  @Column({ name: 'telegram_chat_id', nullable: true })
  telegramChatId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
