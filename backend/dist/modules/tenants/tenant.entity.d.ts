export declare enum TenantStatus {
    ACTIVE = "active",
    BLOCKED = "blocked",
    TRIAL = "trial"
}
export declare class Tenant {
    id: string;
    slug: string;
    name: string;
    phone: string;
    address: string;
    status: TenantStatus;
    isBlocked: boolean;
    blockedReason: string;
    createdAt: Date;
    updatedAt: Date;
}
