import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum SyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  FAILED = 'failed',
}

@Entity('sync_queue')
@Index(['tenantId', 'status', 'createdAt'])
export class SyncQueue extends BaseEntity {
  @Column({ name: 'device_id' })
  deviceId: string;

  @Column({ name: 'entity_type' })
  entityType: string;

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ type: 'enum', enum: SyncOperation })
  operation: SyncOperation;

  @Column({ type: 'jsonb', nullable: true })
  payload: object;

  @Column({ type: 'enum', enum: SyncStatus, default: SyncStatus.PENDING })
  status: SyncStatus;

  @Column({ name: 'synced_at', type: 'timestamptz', nullable: true })
  syncedAt: Date;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string;

  @Column({ name: 'client_timestamp', type: 'timestamptz' })
  clientTimestamp: Date;
}
