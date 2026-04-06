"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("@nestjs/typeorm");
const typeorm_4 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
const user_entity_1 = require("../auth/user.entity");
const subscription_entity_1 = require("../subscriptions/subscription.entity");
const audit_log_entity_1 = require("./audit-log.entity");
let AdminService = class AdminService {
    tenantRepo;
    userRepo;
    subRepo;
    auditRepo;
    dataSource;
    constructor(tenantRepo, userRepo, subRepo, auditRepo, dataSource) {
        this.tenantRepo = tenantRepo;
        this.userRepo = userRepo;
        this.subRepo = subRepo;
        this.auditRepo = auditRepo;
        this.dataSource = dataSource;
    }
    async listTenants(page = 1, limit = 20) {
        const [items, total] = await this.tenantRepo.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
    async getTenantDetails(tenantId) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const [users, subscription] = await Promise.all([
            this.userRepo.find({ where: { tenantId } }),
            this.subRepo.findOne({ where: { tenantId }, relations: ['plan'] }),
        ]);
        const stats = await this.dataSource.query(`SELECT
        (SELECT COUNT(*) FROM sales WHERE tenant_id = $1) as sales_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE tenant_id = $1) as total_revenue,
        (SELECT COUNT(*) FROM products WHERE tenant_id = $1 AND is_active = true) as products_count,
        (SELECT COUNT(*) FROM customers WHERE tenant_id = $1) as customers_count`, [tenantId]);
        return { tenant, users, subscription, stats: stats[0] };
    }
    async blockTenant(tenantId, reason) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        tenant.isBlocked = true;
        tenant.blockedReason = reason;
        tenant.status = tenant_entity_1.TenantStatus.BLOCKED;
        return this.tenantRepo.save(tenant);
    }
    async unblockTenant(tenantId) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        tenant.isBlocked = false;
        tenant.blockedReason = '';
        tenant.status = tenant_entity_1.TenantStatus.ACTIVE;
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
    async getAuditLogs(tenantId, page = 1, limit = 50) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        const [items, total] = await this.auditRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(3, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(4, (0, typeorm_3.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_4.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map