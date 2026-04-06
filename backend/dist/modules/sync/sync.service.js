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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sync_queue_entity_1 = require("./sync-queue.entity");
let SyncService = SyncService_1 = class SyncService {
    syncQueueRepo;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(syncQueueRepo) {
        this.syncQueueRepo = syncQueueRepo;
    }
    async push(tenantId, deviceId, changes) {
        const results = [];
        for (const change of changes) {
            try {
                const entry = this.syncQueueRepo.create({
                    tenantId,
                    deviceId,
                    entityType: change.entityType,
                    entityId: change.entityId,
                    operation: change.operation,
                    payload: change.payload,
                    clientTimestamp: new Date(change.clientTimestamp),
                    status: sync_queue_entity_1.SyncStatus.SYNCED,
                    syncedAt: new Date(),
                });
                await this.syncQueueRepo.save(entry);
                results.push({ entityId: change.entityId, status: 'synced' });
            }
            catch (err) {
                this.logger.error(`Sync failed for ${change.entityId}: ${err.message}`);
                results.push({ entityId: change.entityId, status: 'failed' });
            }
        }
        return results;
    }
    async pull(tenantId, deviceId, lastSync) {
        const since = lastSync ? new Date(lastSync) : new Date(0);
        const changes = await this.syncQueueRepo.find({
            where: {
                tenantId,
                status: sync_queue_entity_1.SyncStatus.SYNCED,
                syncedAt: (0, typeorm_2.MoreThan)(since),
            },
            order: { syncedAt: 'ASC' },
            take: 500,
        });
        return {
            changes: changes.filter((c) => c.deviceId !== deviceId),
            serverTime: new Date().toISOString(),
        };
    }
    async getStatus(tenantId) {
        const pending = await this.syncQueueRepo.count({
            where: { tenantId, status: sync_queue_entity_1.SyncStatus.PENDING },
        });
        const failed = await this.syncQueueRepo.count({
            where: { tenantId, status: sync_queue_entity_1.SyncStatus.FAILED },
        });
        return { pending, failed };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sync_queue_entity_1.SyncQueue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SyncService);
//# sourceMappingURL=sync.service.js.map