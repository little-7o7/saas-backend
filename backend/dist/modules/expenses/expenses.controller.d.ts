import { ExpensesService } from './expenses.service';
import { User } from '../auth/user.entity';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    listCategories(tenantId: string): Promise<import("./expense-category.entity").ExpenseCategory[]>;
    createCategory(tenantId: string, dto: any): Promise<import("./expense-category.entity").ExpenseCategory>;
    findAll(tenantId: string, from?: string, to?: string): Promise<import("./expense.entity").Expense[]>;
    create(tenantId: string, user: User, dto: any): Promise<import("./expense.entity").Expense[]>;
}
