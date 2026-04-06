import { BaseEntity } from '../../common/entities/base.entity';
export declare class Invoice extends BaseEntity {
    invoiceNumber: string;
    saleId: string;
    customerId: string;
    customerName: string;
    totalAmount: number;
    paidAmount: number;
    qrCode: string;
    publicUrl: string;
    itemsSnapshot: object;
    smsSent: boolean;
    telegramSent: boolean;
}
