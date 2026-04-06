import { ConfigService } from '@nestjs/config';
export declare class TelegramService {
    private config;
    private readonly logger;
    private readonly baseUrl;
    constructor(config: ConfigService);
    send(chatId: string, message: string): Promise<boolean>;
}
