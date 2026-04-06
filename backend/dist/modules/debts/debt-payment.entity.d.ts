import { BaseEntity } from '../../common/entities/base.entity';
import { Debt } from './debt.entity';
export declare class DebtPayment extends BaseEntity {
    debtId: string;
    debt: Debt;
    amount: number;
    comment: string;
    createdBy: string;
}
