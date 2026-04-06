import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private customerRepo: Repository<Customer>) {}

  findAll(tenantId: string, search?: string) {
    const qb = this.customerRepo
      .createQueryBuilder('c')
      .where('c.tenant_id = :tenantId AND c.is_active = true', { tenantId });
    if (search) qb.andWhere('c.name ILIKE :s OR c.phone ILIKE :s', { s: `%${search}%` });
    return qb.orderBy('c.name', 'ASC').getMany();
  }

  async findById(tenantId: string, id: string) {
    const c = await this.customerRepo.findOne({ where: { id, tenantId } });
    if (!c) throw new NotFoundException('Customer not found');
    return c;
  }

  create(tenantId: string, dto: Partial<Customer>) {
    const c = this.customerRepo.create({ ...dto, tenantId });
    return this.customerRepo.save(c);
  }

  async update(tenantId: string, id: string, dto: Partial<Customer>) {
    const c = await this.findById(tenantId, id);
    Object.assign(c, dto);
    return this.customerRepo.save(c);
  }
}
