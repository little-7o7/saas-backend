import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../customers/customer.entity';
import { SaleItem } from './sale-item.entity';
export declare enum PaymentType {
    CASH = "cash",
    CARD = "card",
    TRANSFER = "transfer",
    MIXED = "mixed"
}
export declare class Sale extends BaseEntity {
    saleNumber: string;
    customerId: string;
    customer: Customer;
    totalAmount: number;
    paidAmount: number;
    debtAmount: number;
    paymentType: PaymentType;
    comment: string;
    createdBy: string;
    warehouseId: string;
    items: SaleItem[];
}
