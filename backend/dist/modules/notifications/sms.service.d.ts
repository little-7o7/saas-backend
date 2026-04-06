import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private config;
    private readonly logger;
    private token;
    private tokenExpiry;
    constructor(config: ConfigService);
    private getToken;
    send(phone: string, message: string): Promise<boolean>;
    buildDebtReminder(storeName: string, amount: number): string;
    buildInvoiceMessage(storeName: string, storePhone: string, invoiceUrl: string): string;
}
