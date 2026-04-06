"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackCashModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const black_cash_entity_1 = require("./black-cash.entity");
const black_cash_controller_1 = require("./black-cash.controller");
const black_cash_service_1 = require("./black-cash.service");
let BlackCashModule = class BlackCashModule {
};
exports.BlackCashModule = BlackCashModule;
exports.BlackCashModule = BlackCashModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([black_cash_entity_1.BlackCashTransaction])],
        controllers: [black_cash_controller_1.BlackCashController],
        providers: [black_cash_service_1.BlackCashService],
        exports: [black_cash_service_1.BlackCashService],
    })
], BlackCashModule);
//# sourceMappingURL=black-cash.module.js.map