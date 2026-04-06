import { BaseEntity } from '../../common/entities/base.entity';
export declare enum SyncOperation {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare enum SyncStatus {
    PENDING = "pending",
    SYNCED = "synced",
    FAILED = "failed"
}
export declare class SyncQueue extends BaseEntity {
    deviceId: string;
    entityType: string;
    entityId: string;
    operation: SyncOperation;
    payload: object;
    status: SyncStatus;
    syncedAt: Date;
    errorMessage: string;
    clientTimestamp: Date;
}
