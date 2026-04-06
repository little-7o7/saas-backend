import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SyncQueue, SyncOperation, SyncStatus } from './sync-queue.entity';

export interface SyncChangeDto {
  localId?: string;
  entityType: string;
  entityId: string;
  operation: SyncOperation;
  payload: object;
  clientTimestamp: string;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(SyncQueue) private syncQueueRepo: Repository<SyncQueue>,
  ) {}

  async push(tenantId: string, deviceId: string, changes: SyncChangeDto[]) {
    const results: { entityId: string; status: string }[] = [];

    for (const change of changes) {
      try {
        const entry = this.syncQueueRepo.create({
          tenantId,
          deviceId,
          entityType: change.entityType,
          entityId: change.entityId,
          operation: change.operation,
          payload: change.payload,
          clientTimestamp: new Date(change.clientTimestamp),
          status: SyncStatus.SYNCED,
          syncedAt: new Date(),
        });
        await this.syncQueueRepo.save(entry);
        results.push({ entityId: change.entityId, status: 'synced' });
      } catch (err) {
        this.logger.error(`Sync failed for ${change.entityId}: ${err.message}`);
        results.push({ entityId: change.entityId, status: 'failed' });
      }
    }

    return results;
  }

  async pull(tenantId: string, deviceId: string, lastSync: string) {
    const since = lastSync ? new Date(lastSync) : new Date(0);

    const changes = await this.syncQueueRepo.find({
      where: {
        tenantId,
        status: SyncStatus.SYNCED,
        syncedAt: MoreThan(since),
      },
      order: { syncedAt: 'ASC' },
      take: 500,
    });

    return {
      changes: changes.filter((c) => c.deviceId !== deviceId),
      serverTime: new Date().toISOString(),
    };
  }

  async getStatus(tenantId: string) {
    const pending = await this.syncQueueRepo.count({
      where: { tenantId, status: SyncStatus.PENDING },
    });
    const failed = await this.syncQueueRepo.count({
      where: { tenantId, status: SyncStatus.FAILED },
    });
    return { pending, failed };
  }
}
