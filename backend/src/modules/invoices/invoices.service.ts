import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from './invoice.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { SmsService } from '../notifications/sms.service';
import { TelegramService } from '../notifications/telegram.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private notificationsService: NotificationsService,
    private smsService: SmsService,
    private telegramService: TelegramService,
    private config: ConfigService,
  ) {}

  async create(data: {
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
  }): Promise<Invoice> {
    const invoiceNumber = `INV-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;
    const baseUrl = this.config.get('INVOICE_BASE_URL', 'http://localhost:3000/invoice');
    const publicUrl = `${baseUrl}/${invoiceNumber}`;

    const qrCode = await QRCode.toDataURL(publicUrl);

    const invoice = this.invoiceRepo.create({
      tenantId: data.tenantId,
      invoiceNumber,
      saleId: data.saleId,
      customerId: data.customerId,
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      paidAmount: data.paidAmount,
      qrCode,
      publicUrl,
      itemsSnapshot: data.items,
    });

    const saved = await this.invoiceRepo.save(invoice);

    if (data.customerPhone) {
      const msg = this.smsService.buildInvoiceMessage(
        data.storeName,
        data.storePhone,
        publicUrl,
      );
      await this.notificationsService.sendSms(
        data.tenantId,
        data.customerPhone,
        msg,
        'invoice',
        saved.id,
      );
      saved.smsSent = true;
    }

    if (data.customerTelegramId) {
      const msg = `<b>${data.storeName}</b>\n📋 Chek: <a href="${publicUrl}">${invoiceNumber}</a>\nSumma: ${data.totalAmount.toLocaleString()} UZS`;
      await this.notificationsService.sendTelegram(
        data.tenantId,
        data.customerTelegramId,
        msg,
        'invoice',
        saved.id,
      );
      saved.telegramSent = true;
    }

    return this.invoiceRepo.save(saved);
  }

  async findByNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({ where: { invoiceNumber } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async findAll(tenantId: string) {
    return this.invoiceRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
