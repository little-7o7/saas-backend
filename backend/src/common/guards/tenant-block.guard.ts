import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, TenantStatus } from '../../modules/tenants/tenant.entity';

@Injectable()
export class TenantBlockGuard implements CanActivate {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user?.tenantId) return true;

    const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
    if (tenant?.isBlocked) {
      throw new ForbiddenException(`Store is blocked: ${tenant.blockedReason || 'contact support'}`);
    }
    return true;
  }
}
