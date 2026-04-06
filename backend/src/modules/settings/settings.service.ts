import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

const DEFAULT_SETTINGS = {
  auto_sms: { enabled: true },
  auto_invoice: { enabled: true },
  debt_warning: { enabled: true, threshold_percent: 80 },
  sms_on_sale: { enabled: true },
  telegram_on_sale: { enabled: false },
};

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Settings) private settingsRepo: Repository<Settings>) {}

  async get(tenantId: string, key: string): Promise<object> {
    const setting = await this.settingsRepo.findOne({ where: { tenantId, key } });
    return setting?.value ?? DEFAULT_SETTINGS[key] ?? {};
  }

  async getAll(tenantId: string): Promise<Record<string, object>> {
    const settings = await this.settingsRepo.find({ where: { tenantId } });
    const result: Record<string, object> = { ...DEFAULT_SETTINGS };
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  async set(tenantId: string, key: string, value: object): Promise<Settings> {
    let setting = await this.settingsRepo.findOne({ where: { tenantId, key } });
    if (!setting) {
      setting = this.settingsRepo.create({ tenantId, key, value });
    } else {
      setting.value = value;
    }
    return this.settingsRepo.save(setting);
  }
}
