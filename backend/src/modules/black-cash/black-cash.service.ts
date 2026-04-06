import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlackCashTransaction, BlackCashType } from './black-cash.entity';

@Injectable()
export class BlackCashService {
  constructor(
    @InjectRepository(BlackCashTransaction) private txRepo: Repository<BlackCashTransaction>,
  ) {}

  findAll(tenantId: string, from?: string, to?: string) {
    const qb = this.txRepo
      .createQueryBuilder('t')
      .where('t.tenant_id = :tenantId', { tenantId })
      .orderBy('t.created_at', 'DESC');
    if (from) qb.andWhere('t.created_at >= :from', { from });
    if (to) qb.andWhere('t.created_at <= :to', { to });
    return qb.getMany();
  }

  create(tenantId: string, dto: any) {
    const tx = this.txRepo.create({ ...dto, tenantId });
    return this.txRepo.save(tx);
  }

  async getBalance(tenantId: string) {
    const result = await this.txRepo
      .createQueryBuilder('t')
      .select('t.type', 'type')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.tenant_id = :tenantId', { tenantId })
      .groupBy('t.type')
      .getRawMany();

    let balance = 0;
    for (const r of result) {
      if (r.type === BlackCashType.DEPOSIT || r.type === BlackCashType.PROFIT) {
        balance += Number(r.total);
      } else {
        balance -= Number(r.total);
      }
    }
    return { balance, breakdown: result };
  }
}
