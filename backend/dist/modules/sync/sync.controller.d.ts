import { SyncService, SyncChangeDto } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    push(tenantId: string, deviceId: string, body: {
        changes: SyncChangeDto[];
    }): Promise<{
        entityId: string;
        status: string;
    }[]>;
    pull(tenantId: string, deviceId: string, lastSync: string): Promise<{
        changes: import("./sync-queue.entity").SyncQueue[];
        serverTime: string;
    }>;
    status(tenantId: string): Promise<{
        pending: number;
        failed: number;
    }>;
}
