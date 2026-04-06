import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpenseCategory } from './expense-category.entity';
export declare class ExpensesService {
    private expenseRepo;
    private categoryRepo;
    constructor(expenseRepo: Repository<Expense>, categoryRepo: Repository<ExpenseCategory>);
    findAllCategories(tenantId: string): Promise<ExpenseCategory[]>;
    createCategory(tenantId: string, dto: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    findAll(tenantId: string, from?: string, to?: string): Promise<Expense[]>;
    create(tenantId: string, dto: any): Promise<Expense[]>;
    autoCreateRecurring(tenantId: string): Promise<Expense[]>;
}
