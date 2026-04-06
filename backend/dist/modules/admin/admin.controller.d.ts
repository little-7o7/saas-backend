import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    stats(): Promise<any>;
    listTenants(page?: string, limit?: string): Promise<{
        items: import("../tenants/tenant.entity").Tenant[];
        total: number;
        page: number;
        limit: number;
    }>;
    tenantDetails(id: string): Promise<{
        tenant: import("../tenants/tenant.entity").Tenant;
        users: import("../auth/user.entity").User[];
        subscription: import("../subscriptions/subscription.entity").Subscription | null;
        stats: any;
    }>;
    blockTenant(id: string, dto: {
        reason: string;
    }): Promise<import("../tenants/tenant.entity").Tenant>;
    unblockTenant(id: string): Promise<import("../tenants/tenant.entity").Tenant>;
    auditLogs(tenantId?: string, page?: string, limit?: string): Promise<{
        items: import("./audit-log.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
