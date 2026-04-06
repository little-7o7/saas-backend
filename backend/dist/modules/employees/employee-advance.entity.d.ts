import { BaseEntity } from '../../common/entities/base.entity';
import { Employee } from './employee.entity';
export declare class EmployeeAdvance extends BaseEntity {
    employeeId: string;
    employee: Employee;
    amount: number;
    advanceDate: string;
    comment: string;
    createdBy: string;
}
