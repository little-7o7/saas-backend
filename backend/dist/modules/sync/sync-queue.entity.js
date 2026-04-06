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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncQueue = exports.SyncStatus = exports.SyncOperation = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
var SyncOperation;
(function (SyncOperation) {
    SyncOperation["CREATE"] = "create";
    SyncOperation["UPDATE"] = "update";
    SyncOperation["DELETE"] = "delete";
})(SyncOperation || (exports.SyncOperation = SyncOperation = {}));
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "pending";
    SyncStatus["SYNCED"] = "synced";
    SyncStatus["FAILED"] = "failed";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
let SyncQueue = class SyncQueue extends base_entity_1.BaseEntity {
    deviceId;
    entityType;
    entityId;
    operation;
    payload;
    status;
    syncedAt;
    errorMessage;
    clientTimestamp;
};
exports.SyncQueue = SyncQueue;
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id' }),
    __metadata("design:type", String)
], SyncQueue.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type' }),
    __metadata("design:type", String)
], SyncQueue.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_id' }),
    __metadata("design:type", String)
], SyncQueue.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SyncOperation }),
    __metadata("design:type", String)
], SyncQueue.prototype, "operation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SyncQueue.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SyncStatus, default: SyncStatus.PENDING }),
    __metadata("design:type", String)
], SyncQueue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'synced_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SyncQueue.prototype, "syncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', nullable: true }),
    __metadata("design:type", String)
], SyncQueue.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_timestamp', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SyncQueue.prototype, "clientTimestamp", void 0);
exports.SyncQueue = SyncQueue = __decorate([
    (0, typeorm_1.Entity)('sync_queue'),
    (0, typeorm_1.Index)(['tenantId', 'status', 'createdAt'])
], SyncQueue);
//# sourceMappingURL=sync-queue.entity.js.map