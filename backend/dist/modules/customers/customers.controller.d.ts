import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(tenantId: string, search?: string): Promise<import("./customer.entity").Customer[]>;
    findOne(tenantId: string, id: string): Promise<import("./customer.entity").Customer>;
    create(tenantId: string, dto: any): Promise<import("./customer.entity").Customer>;
    update(tenantId: string, id: string, dto: any): Promise<import("./customer.entity").Customer>;
}
