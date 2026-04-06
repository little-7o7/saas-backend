import { BaseEntity } from '../../common/entities/base.entity';
import { ExpenseCategory } from './expense-category.entity';
export declare class Expense extends BaseEntity {
    categoryId: string;
    category: ExpenseCategory;
    name: string;
    amount: number;
    expenseDate: string;
    comment: string;
    isAuto: boolean;
    createdBy: string;
}
