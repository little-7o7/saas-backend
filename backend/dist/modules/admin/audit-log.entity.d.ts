export declare class AuditLog {
    id: string;
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    before: object;
    after: object;
    ipAddress: string;
    createdAt: Date;
}
