import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpenseCategory, ExpensePeriod } from './expense-category.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @InjectRepository(ExpenseCategory) private categoryRepo: Repository<ExpenseCategory>,
  ) {}

  findAllCategories(tenantId: string) {
    return this.categoryRepo.find({ where: { tenantId } });
  }

  createCategory(tenantId: string, dto: Partial<ExpenseCategory>) {
    const cat = this.categoryRepo.create({ ...dto, tenantId });
    return this.categoryRepo.save(cat);
  }

  findAll(tenantId: string, from?: string, to?: string) {
    const qb = this.expenseRepo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'c')
      .where('e.tenant_id = :tenantId', { tenantId })
      .orderBy('e.expense_date', 'DESC');

    if (from) qb.andWhere('e.expense_date >= :from', { from });
    if (to) qb.andWhere('e.expense_date <= :to', { to });

    return qb.getMany();
  }

  create(tenantId: string, dto: any) {
    const expense = this.expenseRepo.create({ ...dto, tenantId });
    return this.expenseRepo.save(expense);
  }

  async autoCreateRecurring(tenantId: string) {
    const recurringCategories = await this.categoryRepo.find({
      where: { tenantId, isRecurring: true },
    });

    const today = new Date().toISOString().split('T')[0];
    const created: Expense[] = [];

    for (const cat of recurringCategories) {
      const existing = await this.expenseRepo.findOne({
        where: { tenantId, categoryId: cat.id, expenseDate: today },
      });
      if (existing) continue;

      const expense = this.expenseRepo.create({
        tenantId,
        categoryId: cat.id,
        name: cat.name,
        amount: 0,
        expenseDate: today,
        isAuto: true,
        createdBy: 'system',
      });
      created.push(await this.expenseRepo.save(expense));
    }

    return created;
  }
}
