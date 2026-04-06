import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PlanType, unique: true })
  type: PlanType;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'max_products', default: 100 })
  maxProducts: number;

  @Column({ name: 'max_employees', default: 3 })
  maxEmployees: number;

  @Column({ name: 'max_warehouses', default: 1 })
  maxWarehouses: number;

  @Column({ name: 'sms_enabled', default: false })
  smsEnabled: boolean;

  @Column({ name: 'analytics_enabled', default: false })
  analyticsEnabled: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
