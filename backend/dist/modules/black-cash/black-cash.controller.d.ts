import { BlackCashService } from './black-cash.service';
import { User } from '../auth/user.entity';
export declare class BlackCashController {
    private readonly blackCashService;
    constructor(blackCashService: BlackCashService);
    findAll(tenantId: string, from?: string, to?: string): Promise<import("./black-cash.entity").BlackCashTransaction[]>;
    getBalance(tenantId: string): Promise<{
        balance: number;
        breakdown: any[];
    }>;
    create(tenantId: string, user: User, dto: any): Promise<import("./black-cash.entity").BlackCashTransaction[]>;
}
