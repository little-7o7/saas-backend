import { BaseEntity } from '../../common/entities/base.entity';
export declare enum BlackCashType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    PROFIT = "profit"
}
export declare enum BlackCashPeriod {
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    ONE_TIME = "one_time"
}
export declare class BlackCashTransaction extends BaseEntity {
    type: BlackCashType;
    amount: number;
    period: BlackCashPeriod;
    description: string;
    createdBy: string;
}
