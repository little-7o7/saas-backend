import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Debt, DebtStatus } from './debt.entity';
import { DebtPayment } from './debt-payment.entity';
import { Customer } from '../customers/customer.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { SmsService } from '../notifications/sms.service';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt) private debtRepo: Repository<Debt>,
    @InjectRepository(DebtPayment) private paymentRepo: Repository<DebtPayment>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private notificationsService: NotificationsService,
    private smsService: SmsService,
    private dataSource: DataSource,
  ) {}

  async findAll(tenantId: string, customerId?: string) {
    const where: any = { tenantId };
    if (customerId) where.customerId = customerId;
    return this.debtRepo.find({
      where,
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCustomerDebts(tenantId: string, customerId: string) {
    return this.debtRepo.find({
      where: { tenantId, customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async payDebt(tenantId: string, debtId: string, amount: number, userId: string, comment?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const debt = await queryRunner.manager.findOne(Debt, {
        where: { id: debtId, tenantId },
        relations: ['customer'],
      });
      if (!debt) throw new NotFoundException('Debt not found');

      const payment = queryRunner.manager.create(DebtPayment, {
        tenantId,
        debtId,
        amount,
        comment,
        createdBy: userId,
      });
      await queryRunner.manager.save(payment);

      debt.remainingAmount = Number(debt.remainingAmount) - amount;
      if (debt.remainingAmount <= 0) {
        debt.remainingAmount = 0;
        debt.status = DebtStatus.PAID;
      } else {
        debt.status = DebtStatus.PARTIAL;
      }
      await queryRunner.manager.save(debt);

      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: debt.customerId, tenantId },
      });
      if (customer) {
        customer.totalDebt = Math.max(0, Number(customer.totalDebt) - amount);
        await queryRunner.manager.save(customer);
      }

      await queryRunner.commitTransaction();
      return debt;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async sendReminders(tenantId: string): Promise<{ sent: number; failed: number }> {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
    if (!tenant) return { sent: 0, failed: 0 };

    const openDebts = await this.debtRepo.find({
      where: { tenantId, status: DebtStatus.OPEN },
      relations: ['customer'],
    });

    let sent = 0;
    let failed = 0;

    for (const debt of openDebts) {
      if (!debt.customer?.phone) continue;
      const msg = `${tenant.name}: Sizning qarzingiz ${Number(debt.remainingAmount).toLocaleString()} UZS. Iltimos to'lang.`;
      const ok = await this.notificationsService.sendSms(
        tenantId,
        debt.customer.phone,
        msg,
        'debt',
        debt.id,
      );
      if (ok) {
        debt.lastReminderAt = new Date();
        await this.debtRepo.save(debt);
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }
}
