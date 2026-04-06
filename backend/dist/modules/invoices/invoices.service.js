"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const QRCode = __importStar(require("qrcode"));
const uuid_1 = require("uuid");
const invoice_entity_1 = require("./invoice.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const sms_service_1 = require("../notifications/sms.service");
const telegram_service_1 = require("../notifications/telegram.service");
let InvoicesService = class InvoicesService {
    invoiceRepo;
    notificationsService;
    smsService;
    telegramService;
    config;
    constructor(invoiceRepo, notificationsService, smsService, telegramService, config) {
        this.invoiceRepo = invoiceRepo;
        this.notificationsService = notificationsService;
        this.smsService = smsService;
        this.telegramService = telegramService;
        this.config = config;
    }
    async create(data) {
        const invoiceNumber = `INV-${Date.now()}-${(0, uuid_1.v4)().substring(0, 4).toUpperCase()}`;
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
            const msg = this.smsService.buildInvoiceMessage(data.storeName, data.storePhone, publicUrl);
            await this.notificationsService.sendSms(data.tenantId, data.customerPhone, msg, 'invoice', saved.id);
            saved.smsSent = true;
        }
        if (data.customerTelegramId) {
            const msg = `<b>${data.storeName}</b>\n📋 Chek: <a href="${publicUrl}">${invoiceNumber}</a>\nSumma: ${data.totalAmount.toLocaleString()} UZS`;
            await this.notificationsService.sendTelegram(data.tenantId, data.customerTelegramId, msg, 'invoice', saved.id);
            saved.telegramSent = true;
        }
        return this.invoiceRepo.save(saved);
    }
    async findByNumber(invoiceNumber) {
        const invoice = await this.invoiceRepo.findOne({ where: { invoiceNumber } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async findAll(tenantId) {
        return this.invoiceRepo.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        sms_service_1.SmsService,
        telegram_service_1.TelegramService,
        config_1.ConfigService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map