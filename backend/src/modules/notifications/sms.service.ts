import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface EskizTokenResponse {
  data: { token: string };
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private config: ConfigService) {}

  private async getToken(): Promise<string> {
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    const { data } = await axios.post<EskizTokenResponse>(
      'https://notify.eskiz.uz/api/auth/login',
      {
        email: this.config.get('SMS_EMAIL'),
        password: this.config.get('SMS_PASSWORD'),
      },
    );

    this.token = data.data.token;
    this.tokenExpiry = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
    return this.token;
  }

  async send(phone: string, message: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const token = await this.getToken();
      await axios.post(
        'https://notify.eskiz.uz/api/message/sms/send',
        {
          mobile_phone: cleanPhone,
          message,
          from: this.config.get('SMS_FROM', '4546'),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      this.logger.log(`SMS sent to ${phone}`);
      return true;
    } catch (err) {
      this.logger.error(`SMS failed to ${phone}: ${err.message}`);
      return false;
    }
  }

  buildDebtReminder(storeName: string, amount: number): string {
    return `${storeName}: Sizning qarzingiz ${amount.toLocaleString()} UZS. Iltimos to'lang.`;
  }

  buildInvoiceMessage(storeName: string, storePhone: string, invoiceUrl: string): string {
    const date = new Date().toLocaleDateString('ru-RU');
    return `Magazin: ${storeName}\nTel: ${storePhone}\nSana: ${date}\nChek: ${invoiceUrl}`;
  }
}
