import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { SmsService } from './sms.service';
import { TelegramService } from './telegram.service';
export declare class NotificationsService {
    private notifRepo;
    private smsService;
    private telegramService;
    constructor(notifRepo: Repository<Notification>, smsService: SmsService, telegramService: TelegramService);
    sendSms(tenantId: string, phone: string, message: string, referenceType?: string, referenceId?: string): Promise<boolean>;
    sendTelegram(tenantId: string, chatId: string, message: string, referenceType?: string, referenceId?: string): Promise<boolean>;
    findAll(tenantId: string): Promise<Notification[]>;
}
