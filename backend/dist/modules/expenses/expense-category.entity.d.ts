import { BaseEntity } from '../../common/entities/base.entity';
export declare enum ExpensePeriod {
    DAILY = "daily",
    MONTHLY = "monthly",
    ONE_TIME = "one_time"
}
export declare class ExpenseCategory extends BaseEntity {
    name: string;
    isRecurring: boolean;
    period: ExpensePeriod;
}
