import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { EmployeeWorkday } from './employee-workday.entity';
import { EmployeeAdvance } from './employee-advance.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(EmployeeWorkday) private workdayRepo: Repository<EmployeeWorkday>,
    @InjectRepository(EmployeeAdvance) private advanceRepo: Repository<EmployeeAdvance>,
  ) {}

  findAll(tenantId: string) {
    return this.empRepo.find({ where: { tenantId, isActive: true } });
  }

  async findById(tenantId: string, id: string) {
    const emp = await this.empRepo.findOne({ where: { id, tenantId } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  create(tenantId: string, dto: Partial<Employee>) {
    const emp = this.empRepo.create({ ...dto, tenantId });
    return this.empRepo.save(emp);
  }

  async update(tenantId: string, id: string, dto: Partial<Employee>) {
    const emp = await this.findById(tenantId, id);
    Object.assign(emp, dto);
    return this.empRepo.save(emp);
  }

  async addWorkday(tenantId: string, employeeId: string, dto: {
    workDate: string;
    hoursWorked?: number;
    rateForDay?: number;
    note?: string;
  }) {
    const emp = await this.findById(tenantId, employeeId);
    const workday = this.workdayRepo.create({
      tenantId,
      employeeId,
      workDate: dto.workDate,
      hoursWorked: dto.hoursWorked ?? 8,
      rateForDay: dto.rateForDay ?? emp.dailyRate,
      note: dto.note,
    });
    return this.workdayRepo.save(workday);
  }

  async addAdvance(tenantId: string, employeeId: string, dto: {
    amount: number;
    advanceDate: string;
    comment?: string;
    createdBy: string;
  }) {
    await this.findById(tenantId, employeeId);
    const advance = this.advanceRepo.create({
      tenantId,
      employeeId,
      ...dto,
    });
    return this.advanceRepo.save(advance);
  }

  async getSalaryReport(tenantId: string, employeeId: string, from: string, to: string) {
    const emp = await this.findById(tenantId, employeeId);

    const workdays = await this.workdayRepo
      .createQueryBuilder('w')
      .where('w.tenant_id = :tenantId AND w.employee_id = :employeeId', { tenantId, employeeId })
      .andWhere('w.work_date BETWEEN :from AND :to', { from, to })
      .getMany();

    const advances = await this.advanceRepo
      .createQueryBuilder('a')
      .where('a.tenant_id = :tenantId AND a.employee_id = :employeeId', { tenantId, employeeId })
      .andWhere('a.advance_date BETWEEN :from AND :to', { from, to })
      .getMany();

    const totalEarned = workdays.reduce((sum, w) => sum + Number(w.rateForDay), 0);
    const totalAdvances = advances.reduce((sum, a) => sum + Number(a.amount), 0);
    const netSalary = totalEarned - totalAdvances;

    return {
      employee: emp,
      workdays,
      advances,
      totalEarned,
      totalAdvances,
      netSalary,
      period: { from, to },
    };
  }
}
