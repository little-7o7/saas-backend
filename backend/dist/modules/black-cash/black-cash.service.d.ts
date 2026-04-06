import { Repository } from 'typeorm';
import { BlackCashTransaction } from './black-cash.entity';
export declare class BlackCashService {
    private txRepo;
    constructor(txRepo: Repository<BlackCashTransaction>);
    findAll(tenantId: string, from?: string, to?: string): Promise<BlackCashTransaction[]>;
    create(tenantId: string, dto: any): Promise<BlackCashTransaction[]>;
    getBalance(tenantId: string): Promise<{
        balance: number;
        breakdown: any[];
    }>;
}
