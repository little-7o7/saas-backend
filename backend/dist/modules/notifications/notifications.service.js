"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const sms_service_1 = require("./sms.service");
const telegram_service_1 = require("./telegram.service");
let NotificationsService = class NotificationsService {
    notifRepo;
    smsService;
    telegramService;
    constructor(notifRepo, smsService, telegramService) {
        this.notifRepo = notifRepo;
        this.smsService = smsService;
        this.telegramService = telegramService;
    }
    async sendSms(tenantId, phone, message, referenceType, referenceId) {
        const notif = this.notifRepo.create({
            tenantId,
            type: notification_entity_1.NotificationType.SMS,
            recipient: phone,
            message,
            referenceType,
            referenceId,
        });
        const success = await this.smsService.send(phone, message);
        notif.status = success ? notification_entity_1.NotificationStatus.SENT : notification_entity_1.NotificationStatus.FAILED;
        if (success)
            notif.sentAt = new Date();
        await this.notifRepo.save(notif);
        return success;
    }
    async sendTelegram(tenantId, chatId, message, referenceType, referenceId) {
        const notif = this.notifRepo.create({
            tenantId,
            type: notification_entity_1.NotificationType.TELEGRAM,
            recipient: chatId,
            message,
            referenceType,
            referenceId,
        });
        const success = await this.telegramService.send(chatId, message);
        notif.status = success ? notification_entity_1.NotificationStatus.SENT : notification_entity_1.NotificationStatus.FAILED;
        if (success)
            notif.sentAt = new Date();
        await this.notifRepo.save(notif);
        return success;
    }
    findAll(tenantId) {
        return this.notifRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sms_service_1.SmsService,
        telegram_service_1.TelegramService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map