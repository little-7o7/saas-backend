import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('employees')
@Index(['tenantId', 'phone'])
export class Employee extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  position: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'daily_rate', default: 0 })
  dailyRate: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
