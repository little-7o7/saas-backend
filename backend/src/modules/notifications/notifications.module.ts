import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { SmsService } from './sms.service';
import { TelegramService } from './telegram.service';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [SmsService, TelegramService, NotificationsService],
  exports: [SmsService, TelegramService, NotificationsService],
})
export class NotificationsModule {}
