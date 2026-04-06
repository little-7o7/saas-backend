import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
export declare class OrdersService {
    private orderRepo;
    private itemRepo;
    private dataSource;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, dataSource: DataSource);
    findAll(tenantId: string, status?: OrderStatus): Promise<Order[]>;
    findById(tenantId: string, id: string): Promise<Order>;
    create(tenantId: string, userId: string, dto: {
        customerId?: string;
        items: Array<{
            productId: string;
            variantId?: string;
            quantity: number;
            price: number;
        }>;
        deadlineAt?: string;
        address?: string;
        comment?: string;
    }): Promise<Order>;
    updateStatus(tenantId: string, id: string, status: OrderStatus): Promise<Order>;
}
