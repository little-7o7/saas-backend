import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Employee } from './employee.entity';

@Entity('employee_advances')
export class EmployeeAdvance extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date', name: 'advance_date' })
  advanceDate: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'created_by' })
  createdBy: string;
}
