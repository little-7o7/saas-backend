import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './notification.entity';
import { SmsService } from './sms.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    private smsService: SmsService,
    private telegramService: TelegramService,
  ) {}

  async sendSms(
    tenantId: string,
    phone: string,
    message: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    const notif = this.notifRepo.create({
      tenantId,
      type: NotificationType.SMS,
      recipient: phone,
      message,
      referenceType,
      referenceId,
    });

    const success = await this.smsService.send(phone, message);
    notif.status = success ? NotificationStatus.SENT : NotificationStatus.FAILED;
    if (success) notif.sentAt = new Date();
    await this.notifRepo.save(notif);
    return success;
  }

  async sendTelegram(
    tenantId: string,
    chatId: string,
    message: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    const notif = this.notifRepo.create({
      tenantId,
      type: NotificationType.TELEGRAM,
      recipient: chatId,
      message,
      referenceType,
      referenceId,
    });

    const success = await this.telegramService.send(chatId, message);
    notif.status = success ? NotificationStatus.SENT : NotificationStatus.FAILED;
    if (success) notif.sentAt = new Date();
    await this.notifRepo.save(notif);
    return success;
  }

  findAll(tenantId: string) {
    return this.notifRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
