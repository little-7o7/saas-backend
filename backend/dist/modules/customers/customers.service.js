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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
let CustomersService = class CustomersService {
    customerRepo;
    constructor(customerRepo) {
        this.customerRepo = customerRepo;
    }
    findAll(tenantId, search) {
        const qb = this.customerRepo
            .createQueryBuilder('c')
            .where('c.tenant_id = :tenantId AND c.is_active = true', { tenantId });
        if (search)
            qb.andWhere('c.name ILIKE :s OR c.phone ILIKE :s', { s: `%${search}%` });
        return qb.orderBy('c.name', 'ASC').getMany();
    }
    async findById(tenantId, id) {
        const c = await this.customerRepo.findOne({ where: { id, tenantId } });
        if (!c)
            throw new common_1.NotFoundException('Customer not found');
        return c;
    }
    create(tenantId, dto) {
        const c = this.customerRepo.create({ ...dto, tenantId });
        return this.customerRepo.save(c);
    }
    async update(tenantId, id, dto) {
        const c = await this.findById(tenantId, id);
        Object.assign(c, dto);
        return this.customerRepo.save(c);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map