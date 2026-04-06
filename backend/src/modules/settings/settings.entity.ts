import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('settings')
@Index(['tenantId', 'key'], { unique: true })
export class Settings extends BaseEntity {
  @Column()
  key: string;

  @Column({ type: 'jsonb' })
  value: object;

  @Column({ nullable: true })
  description: string;
}
