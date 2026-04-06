import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    NEW = "new",
    PROCESSING = "processing",
    DONE = "done",
    CANCELED = "canceled"
}
export declare class Order extends BaseEntity {
    orderNumber: string;
    customerId: string;
    customer: Customer;
    status: OrderStatus;
    deadlineAt: Date;
    address: string;
    comment: string;
    totalAmount: number;
    createdBy: string;
    items: OrderItem[];
}
