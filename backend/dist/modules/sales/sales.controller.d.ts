import { SalesService } from './sales.service';
import type { CreateSaleDto } from './sales.service';
import { User } from '../auth/user.entity';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    findAll(tenantId: string, from?: string, to?: string): Promise<import("./sale.entity").Sale[]>;
    findOne(tenantId: string, id: string): Promise<import("./sale.entity").Sale>;
    create(tenantId: string, user: User, dto: CreateSaleDto): Promise<import("./sale.entity").Sale>;
}
