import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { AuditLog } from './audit-log.entity';
export declare class AdminService {
    private tenantRepo;
    private userRepo;
    private subRepo;
    private auditRepo;
    private dataSource;
    constructor(tenantRepo: Repository<Tenant>, userRepo: Repository<User>, subRepo: Repository<Subscription>, auditRepo: Repository<AuditLog>, dataSource: DataSource);
    listTenants(page?: number, limit?: number): Promise<{
        items: Tenant[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTenantDetails(tenantId: string): Promise<{
        tenant: Tenant;
        users: User[];
        subscription: Subscription | null;
        stats: any;
    }>;
    blockTenant(tenantId: string, reason: string): Promise<Tenant>;
    unblockTenant(tenantId: string): Promise<Tenant>;
    getSystemStats(): Promise<any>;
    getAuditLogs(tenantId?: string, page?: number, limit?: number): Promise<{
        items: AuditLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
