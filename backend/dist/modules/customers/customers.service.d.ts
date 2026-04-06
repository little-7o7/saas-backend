import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
export declare class CustomersService {
    private customerRepo;
    constructor(customerRepo: Repository<Customer>);
    findAll(tenantId: string, search?: string): Promise<Customer[]>;
    findById(tenantId: string, id: string): Promise<Customer>;
    create(tenantId: string, dto: Partial<Customer>): Promise<Customer>;
    update(tenantId: string, id: string, dto: Partial<Customer>): Promise<Customer>;
}
