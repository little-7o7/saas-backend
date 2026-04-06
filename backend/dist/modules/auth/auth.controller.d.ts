import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole, User } from './user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        tenant: import("../tenants/tenant.entity").Tenant;
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
        tenant: import("../tenants/tenant.entity").Tenant | null;
    }>;
    me(user: User): any;
    addEmployee(tenantId: string, dto: any): Promise<{
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
}
