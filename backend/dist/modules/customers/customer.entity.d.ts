import { BaseEntity } from '../../common/entities/base.entity';
export declare class Customer extends BaseEntity {
    name: string;
    phone: string;
    address: string;
    creditLimit: number;
    totalDebt: number;
    telegramChatId: string;
    isActive: boolean;
}
