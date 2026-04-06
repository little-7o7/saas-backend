import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Employee } from './employee.entity';

@Entity('employee_workdays')
@Index(['tenantId', 'employeeId', 'workDate'], { unique: true })
export class EmployeeWorkday extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'work_date', type: 'date' })
  workDate: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'hours_worked', default: 8 })
  hoursWorked: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'rate_for_day' })
  rateForDay: number;

  @Column({ nullable: true })
  note: string;
}
