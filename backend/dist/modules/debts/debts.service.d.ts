import { Repository, DataSource } from 'typeorm';
import { Debt } from './debt.entity';
import { DebtPayment } from './debt-payment.entity';
import { Customer } from '../customers/customer.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { SmsService } from '../notifications/sms.service';
import { Tenant } from '../tenants/tenant.entity';
export declare class DebtsService {
    private debtRepo;
    private paymentRepo;
    private customerRepo;
    private tenantRepo;
    private notificationsService;
    private smsService;
    private dataSource;
    constructor(debtRepo: Repository<Debt>, paymentRepo: Repository<DebtPayment>, customerRepo: Repository<Customer>, tenantRepo: Repository<Tenant>, notificationsService: NotificationsService, smsService: SmsService, dataSource: DataSource);
    findAll(tenantId: string, customerId?: string): Promise<Debt[]>;
    findCustomerDebts(tenantId: string, customerId: string): Promise<Debt[]>;
    payDebt(tenantId: string, debtId: string, amount: number, userId: string, comment?: string): Promise<Debt>;
    sendReminders(tenantId: string): Promise<{
        sent: number;
        failed: number;
    }>;
}
