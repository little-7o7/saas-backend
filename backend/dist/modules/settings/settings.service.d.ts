import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
export declare class SettingsService {
    private settingsRepo;
    constructor(settingsRepo: Repository<Settings>);
    get(tenantId: string, key: string): Promise<object>;
    getAll(tenantId: string): Promise<Record<string, object>>;
    set(tenantId: string, key: string, value: object): Promise<Settings>;
}
