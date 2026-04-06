"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const user_entity_1 = require("./user.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const subscription_entity_1 = require("../subscriptions/subscription.entity");
const subscription_plan_entity_1 = require("../subscriptions/subscription-plan.entity");
let AuthService = class AuthService {
    userRepo;
    tenantRepo;
    subRepo;
    planRepo;
    jwtService;
    dataSource;
    constructor(userRepo, tenantRepo, subRepo, planRepo, jwtService, dataSource) {
        this.userRepo = userRepo;
        this.tenantRepo = tenantRepo;
        this.subRepo = subRepo;
        this.planRepo = planRepo;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async register(dto) {
        const existing = await this.userRepo.findOne({
            where: { phone: dto.phone, tenantId: (0, typeorm_2.IsNull)() },
        });
        if (existing)
            throw new common_1.ConflictException('Phone already registered');
        const slug = dto.storeName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') +
            '-' +
            (0, uuid_1.v4)().substring(0, 6);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const tenant = queryRunner.manager.create(tenant_entity_1.Tenant, {
                slug,
                name: dto.storeName,
                phone: dto.phone,
                status: tenant_entity_1.TenantStatus.TRIAL,
            });
            await queryRunner.manager.save(tenant);
            const passwordHash = await bcrypt.hash(dto.password, 12);
            const user = queryRunner.manager.create(user_entity_1.User, {
                tenantId: tenant.id,
                name: dto.ownerName,
                phone: dto.phone,
                passwordHash,
                role: user_entity_1.UserRole.OWNER,
            });
            await queryRunner.manager.save(user);
            const freePlan = await this.planRepo.findOne({ where: { type: subscription_plan_entity_1.PlanType.FREE } });
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 90);
            const subscription = queryRunner.manager.create(subscription_entity_1.Subscription, {
                tenantId: tenant.id,
                planId: freePlan?.id,
                status: subscription_entity_1.SubscriptionStatus.TRIAL,
                startsAt: new Date(),
                expiresAt: trialEnd,
                trialEndsAt: trialEnd,
            });
            await queryRunner.manager.save(subscription);
            await queryRunner.commitTransaction();
            const token = this.generateToken(user);
            return { token, user: this.sanitizeUser(user), tenant };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(dto) {
        const users = await this.userRepo.find({ where: { phone: dto.phone, isActive: true } });
        if (!users.length)
            throw new common_1.UnauthorizedException('Invalid credentials');
        for (const user of users) {
            const valid = await bcrypt.compare(dto.password, user.passwordHash);
            if (!valid)
                continue;
            const tenant = user.tenantId
                ? await this.tenantRepo.findOne({ where: { id: user.tenantId } })
                : null;
            const token = this.generateToken(user);
            return { token, user: this.sanitizeUser(user), tenant };
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async addEmployee(tenantId, dto) {
        const existingInTenant = await this.userRepo.findOne({
            where: { phone: dto.phone, tenantId },
        });
        if (existingInTenant)
            throw new common_1.ConflictException('User with this phone already exists in store');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepo.create({
            tenantId,
            name: dto.name,
            phone: dto.phone,
            passwordHash,
            role: dto.role || user_entity_1.UserRole.SELLER,
        });
        const saved = await this.userRepo.save(user);
        return this.sanitizeUser(saved);
    }
    async listUsers(tenantId) {
        const users = await this.userRepo.find({ where: { tenantId } });
        return users.map(this.sanitizeUser);
    }
    generateToken(user) {
        return this.jwtService.sign({
            sub: user.id,
            tenantId: user.tenantId,
            role: user.role,
            phone: user.phone,
        });
    }
    sanitizeUser(user) {
        const { passwordHash: _, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(3, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map