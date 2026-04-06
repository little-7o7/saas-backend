import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Invoice } from './invoice.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { SmsService } from '../notifications/sms.service';
import { TelegramService } from '../notifications/telegram.service';
export declare class InvoicesService {
    private invoiceRepo;
    private notificationsService;
    private smsService;
    private telegramService;
    private config;
    constructor(invoiceRepo: Repository<Invoice>, notificationsService: NotificationsService, smsService: SmsService, telegramService: TelegramService, config: ConfigService);
    create(data: {
        tenantId: string;
        saleId: string;
        customerId?: string;
        customerName?: string;
        totalAmount: number;
        paidAmount: number;
        items: object[];
        storeName: string;
        storePhone: string;
        customerPhone?: string;
        customerTelegramId?: string;
    }): Promise<Invoice>;
    findByNumber(invoiceNumber: string): Promise<Invoice>;
    findAll(tenantId: string): Promise<Invoice[]>;
}
