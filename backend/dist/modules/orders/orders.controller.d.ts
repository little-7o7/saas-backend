import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';
import { User } from '../auth/user.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(tenantId: string, status?: OrderStatus): Promise<import("./order.entity").Order[]>;
    findOne(tenantId: string, id: string): Promise<import("./order.entity").Order>;
    create(tenantId: string, user: User, dto: any): Promise<import("./order.entity").Order>;
    updateStatus(tenantId: string, id: string, dto: {
        status: OrderStatus;
    }): Promise<import("./order.entity").Order>;
}
