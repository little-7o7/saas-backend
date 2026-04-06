import { EmployeesService } from './employees.service';
import { User } from '../auth/user.entity';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(tenantId: string): Promise<import("./employee.entity").Employee[]>;
    create(tenantId: string, dto: any): Promise<import("./employee.entity").Employee>;
    update(tenantId: string, id: string, dto: any): Promise<import("./employee.entity").Employee>;
    addWorkday(tenantId: string, id: string, dto: any): Promise<import("./employee-workday.entity").EmployeeWorkday>;
    addAdvance(tenantId: string, id: string, dto: any, user: User): Promise<import("./employee-advance.entity").EmployeeAdvance>;
    salaryReport(tenantId: string, id: string, from: string, to: string): Promise<{
        employee: import("./employee.entity").Employee;
        workdays: import("./employee-workday.entity").EmployeeWorkday[];
        advances: import("./employee-advance.entity").EmployeeAdvance[];
        totalEarned: number;
        totalAdvances: number;
        netSalary: number;
        period: {
            from: string;
            to: string;
        };
    }>;
}
