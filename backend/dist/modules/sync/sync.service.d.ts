import { Repository } from 'typeorm';
import { SyncQueue, SyncOperation } from './sync-queue.entity';
export interface SyncChangeDto {
    localId?: string;
    entityType: string;
    entityId: string;
    operation: SyncOperation;
    payload: object;
    clientTimestamp: string;
}
export declare class SyncService {
    private syncQueueRepo;
    private readonly logger;
    constructor(syncQueueRepo: Repository<SyncQueue>);
    push(tenantId: string, deviceId: string, changes: SyncChangeDto[]): Promise<{
        entityId: string;
        status: string;
    }[]>;
    pull(tenantId: string, deviceId: string, lastSync: string): Promise<{
        changes: SyncQueue[];
        serverTime: string;
    }>;
    getStatus(tenantId: string): Promise<{
        pending: number;
        failed: number;
    }>;
}
