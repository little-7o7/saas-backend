import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly baseUrl: string;

  constructor(private config: ConfigService) {
    const token = this.config.get('TELEGRAM_BOT_TOKEN', '');
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async send(chatId: string, message: string): Promise<boolean> {
    if (!this.config.get('TELEGRAM_BOT_TOKEN')) {
      this.logger.warn('Telegram bot token not configured');
      return false;
    }
    try {
      await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      });
      return true;
    } catch (err) {
      this.logger.error(`Telegram send failed to ${chatId}: ${err.message}`);
      return false;
    }
  }
}
