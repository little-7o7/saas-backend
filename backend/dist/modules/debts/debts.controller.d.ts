import { DebtsService } from './debts.service';
import { User } from '../auth/user.entity';
export declare class DebtsController {
    private readonly debtsService;
    constructor(debtsService: DebtsService);
    findAll(tenantId: string, customerId?: string): Promise<import("./debt.entity").Debt[]>;
    payDebt(tenantId: string, id: string, dto: {
        amount: number;
        comment?: string;
    }, user: User): Promise<import("./debt.entity").Debt>;
    sendReminders(tenantId: string): Promise<{
        sent: number;
        failed: number;
    }>;
}
