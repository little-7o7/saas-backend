import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './user.entity';
import { Tenant, TenantStatus } from '../tenants/tenant.entity';
import { Subscription, SubscriptionStatus } from '../subscriptions/subscription.entity';
import { SubscriptionPlan, PlanType } from '../subscriptions/subscription-plan.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AddEmployeeDto {
  name: string;
  phone: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan) private planRepo: Repository<SubscriptionPlan>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { phone: dto.phone, tenantId: IsNull() as any },
    });
    if (existing) throw new ConflictException('Phone already registered');

    const slug =
      dto.storeName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      uuidv4().substring(0, 6);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenant = queryRunner.manager.create(Tenant, {
        slug,
        name: dto.storeName,
        phone: dto.phone,
        status: TenantStatus.TRIAL,
      });
      await queryRunner.manager.save(tenant);

      const passwordHash = await bcrypt.hash(dto.password, 12);
      const user = queryRunner.manager.create(User, {
        tenantId: tenant.id,
        name: dto.ownerName,
        phone: dto.phone,
        passwordHash,
        role: UserRole.OWNER,
      });
      await queryRunner.manager.save(user);

      const freePlan = await this.planRepo.findOne({ where: { type: PlanType.FREE } });
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 90);

      const subscription = queryRunner.manager.create(Subscription, {
        tenantId: tenant.id,
        planId: freePlan?.id,
        status: SubscriptionStatus.TRIAL,
        startsAt: new Date(),
        expiresAt: trialEnd,
        trialEndsAt: trialEnd,
      });
      await queryRunner.manager.save(subscription);

      await queryRunner.commitTransaction();

      const token = this.generateToken(user);
      return { token, user: this.sanitizeUser(user), tenant };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(dto: LoginDto) {
    const users = await this.userRepo.find({ where: { phone: dto.phone, isActive: true } });
    if (!users.length) throw new UnauthorizedException('Invalid credentials');

    for (const user of users) {
      const valid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!valid) continue;

      const tenant = user.tenantId
        ? await this.tenantRepo.findOne({ where: { id: user.tenantId } })
        : null;

      const token = this.generateToken(user);
      return { token, user: this.sanitizeUser(user), tenant };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async addEmployee(tenantId: string, dto: AddEmployeeDto) {
    const existingInTenant = await this.userRepo.findOne({
      where: { phone: dto.phone, tenantId },
    });
    if (existingInTenant) throw new ConflictException('User with this phone already exists in store');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      tenantId,
      name: dto.name,
      phone: dto.phone,
      passwordHash,
      role: dto.role || UserRole.SELLER,
    });
    const saved = await this.userRepo.save(user);
    return this.sanitizeUser(saved);
  }

  async listUsers(tenantId: string) {
    const users = await this.userRepo.find({ where: { tenantId } });
    return users.map(this.sanitizeUser);
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      phone: user.phone,
    });
  }

  private sanitizeUser(user: User) {
    const { passwordHash: _, ...rest } = user as User & { passwordHash: string };
    return rest;
  }
}
