import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(tenantId: string): Promise<Record<string, object>>;
    set(tenantId: string, key: string, value: object): Promise<import("./settings.entity").Settings>;
}
