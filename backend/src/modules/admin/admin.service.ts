import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Tenant, TenantStatus } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async listTenants(page = 1, limit = 20) {
    const [items, total] = await this.tenantRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async getTenantDetails(tenantId: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [users, subscription] = await Promise.all([
      this.userRepo.find({ where: { tenantId } }),
      this.subRepo.findOne({ where: { tenantId }, relations: ['plan'] }),
    ]);

    const stats = await this.dataSource.query(
      `SELECT
        (SELECT COUNT(*) FROM sales WHERE tenant_id = $1) as sales_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE tenant_id = $1) as total_revenue,
        (SELECT COUNT(*) FROM products WHERE tenant_id = $1 AND is_active = true) as products_count,
        (SELECT COUNT(*) FROM customers WHERE tenant_id = $1) as customers_count`,
      [tenantId],
    );

    return { tenant, users, subscription, stats: stats[0] };
  }

  async blockTenant(tenantId: string, reason: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    tenant.isBlocked = true;
    tenant.blockedReason = reason;
    tenant.status = TenantStatus.BLOCKED;
    return this.tenantRepo.save(tenant);
  }

  async unblockTenant(tenantId: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    tenant.isBlocked = false;
    tenant.blockedReason = '';
    tenant.status = TenantStatus.ACTIVE;
    return this.tenantRepo.save(tenant);
  }

  async getSystemStats() {
    const result = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*) FROM tenants) as total_tenants,
        (SELECT COUNT(*) FROM tenants WHERE is_blocked = false AND status != 'blocked') as active_tenants,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COALESCE(SUM(total_amount), 0) FROM sales) as total_revenue,
        (SELECT COUNT(*) FROM sales) as total_sales
    `);
    return result[0];
  }

  async getAuditLogs(tenantId?: string, page = 1, limit = 50) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;

    const [items, total] = await this.auditRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }
}
