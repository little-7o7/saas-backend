import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { EmployeeWorkday } from './employee-workday.entity';
import { EmployeeAdvance } from './employee-advance.entity';
export declare class EmployeesService {
    private empRepo;
    private workdayRepo;
    private advanceRepo;
    constructor(empRepo: Repository<Employee>, workdayRepo: Repository<EmployeeWorkday>, advanceRepo: Repository<EmployeeAdvance>);
    findAll(tenantId: string): Promise<Employee[]>;
    findById(tenantId: string, id: string): Promise<Employee>;
    create(tenantId: string, dto: Partial<Employee>): Promise<Employee>;
    update(tenantId: string, id: string, dto: Partial<Employee>): Promise<Employee>;
    addWorkday(tenantId: string, employeeId: string, dto: {
        workDate: string;
        hoursWorked?: number;
        rateForDay?: number;
        note?: string;
    }): Promise<EmployeeWorkday>;
    addAdvance(tenantId: string, employeeId: string, dto: {
        amount: number;
        advanceDate: string;
        comment?: string;
        createdBy: string;
    }): Promise<EmployeeAdvance>;
    getSalaryReport(tenantId: string, employeeId: string, from: string, to: string): Promise<{
        employee: Employee;
        workdays: EmployeeWorkday[];
        advances: EmployeeAdvance[];
        totalEarned: number;
        totalAdvances: number;
        netSalary: number;
        period: {
            from: string;
            to: string;
        };
    }>;
}
