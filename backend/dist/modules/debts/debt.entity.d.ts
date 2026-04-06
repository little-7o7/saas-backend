import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';
export declare enum DebtStatus {
    OPEN = "open",
    PARTIAL = "partial",
    PAID = "paid"
}
export declare class Debt extends BaseEntity {
    customerId: string;
    customer: Customer;
    saleId: string;
    originalAmount: number;
    remainingAmount: number;
    status: DebtStatus;
    dueDate: Date;
    comment: string;
    lastReminderAt: Date;
}
