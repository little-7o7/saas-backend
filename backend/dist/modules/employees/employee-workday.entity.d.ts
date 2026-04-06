import { BaseEntity } from '../../common/entities/base.entity';
import { Employee } from './employee.entity';
export declare class EmployeeWorkday extends BaseEntity {
    employeeId: string;
    employee: Employee;
    workDate: string;
    hoursWorked: number;
    rateForDay: number;
    note: string;
}
