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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("./settings.entity");
const DEFAULT_SETTINGS = {
    auto_sms: { enabled: true },
    auto_invoice: { enabled: true },
    debt_warning: { enabled: true, threshold_percent: 80 },
    sms_on_sale: { enabled: true },
    telegram_on_sale: { enabled: false },
};
let SettingsService = class SettingsService {
    settingsRepo;
    constructor(settingsRepo) {
        this.settingsRepo = settingsRepo;
    }
    async get(tenantId, key) {
        const setting = await this.settingsRepo.findOne({ where: { tenantId, key } });
        return setting?.value ?? DEFAULT_SETTINGS[key] ?? {};
    }
    async getAll(tenantId) {
        const settings = await this.settingsRepo.find({ where: { tenantId } });
        const result = { ...DEFAULT_SETTINGS };
        for (const s of settings) {
            result[s.key] = s.value;
        }
        return result;
    }
    async set(tenantId, key, value) {
        let setting = await this.settingsRepo.findOne({ where: { tenantId, key } });
        if (!setting) {
            setting = this.settingsRepo.create({ tenantId, key, value });
        }
        else {
            setting.value = value;
        }
        return this.settingsRepo.save(setting);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settings_entity_1.Settings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map