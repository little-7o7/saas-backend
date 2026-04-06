import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from '../../modules/tenants/tenant.entity';
export declare class TenantBlockGuard implements CanActivate {
    private tenantRepo;
    constructor(tenantRepo: Repository<Tenant>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
