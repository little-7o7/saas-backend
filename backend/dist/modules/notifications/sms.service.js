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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let SmsService = SmsService_1 = class SmsService {
    config;
    logger = new common_1.Logger(SmsService_1.name);
    token = null;
    tokenExpiry = null;
    constructor(config) {
        this.config = config;
    }
    async getToken() {
        if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.token;
        }
        const { data } = await axios_1.default.post('https://notify.eskiz.uz/api/auth/login', {
            email: this.config.get('SMS_EMAIL'),
            password: this.config.get('SMS_PASSWORD'),
        });
        this.token = data.data.token;
        this.tokenExpiry = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
        return this.token;
    }
    async send(phone, message) {
        const cleanPhone = phone.replace(/\D/g, '');
        try {
            const token = await this.getToken();
            await axios_1.default.post('https://notify.eskiz.uz/api/message/sms/send', {
                mobile_phone: cleanPhone,
                message,
                from: this.config.get('SMS_FROM', '4546'),
            }, { headers: { Authorization: `Bearer ${token}` } });
            this.logger.log(`SMS sent to ${phone}`);
            return true;
        }
        catch (err) {
            this.logger.error(`SMS failed to ${phone}: ${err.message}`);
            return false;
        }
    }
    buildDebtReminder(storeName, amount) {
        return `${storeName}: Sizning qarzingiz ${amount.toLocaleString()} UZS. Iltimos to'lang.`;
    }
    buildInvoiceMessage(storeName, storePhone, invoiceUrl) {
        const date = new Date().toLocaleDateString('ru-RU');
        return `Magazin: ${storeName}\nTel: ${storePhone}\nSana: ${date}\nChek: ${invoiceUrl}`;
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map