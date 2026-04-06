import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { SubscriptionPlan } from '../subscriptions/subscription-plan.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface AddEmployeeDto {
    name: string;
    phone: string;
    password: string;
    role?: UserRole;
}
export declare class AuthService {
    private userRepo;
    private tenantRepo;
    private subRepo;
    private planRepo;
    private jwtService;
    private dataSource;
    constructor(userRepo: Repository<User>, tenantRepo: Repository<Tenant>, subRepo: Repository<Subscription>, planRepo: Repository<SubscriptionPlan>, jwtService: JwtService, dataSource: DataSource);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            tenantId: string;
            name: string;
            phone: string;
            role: UserRole;
            isActive: boolean;
            telegramChatId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        tenant: Tenant;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            tenantId: string;
            name: string;
            phone: string;
            role: UserRole;
            isActive: boolean;
            telegramChatId: string;
            createdAt: Date;
            updatedAt: Date;
        };
        tenant: Tenant | null;
    }>;
    addEmployee(tenantId: string, dto: AddEmployeeDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        phone: string;
        role: UserRole;
        isActive: boolean;
        telegramChatId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listUsers(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        phone: string;
        role: UserRole;
        isActive: boolean;
        telegramChatId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    private generateToken;
    private sanitizeUser;
}
