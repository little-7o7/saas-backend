import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    private dataSource: DataSource,
  ) {}

  findAll(tenantId: string, status?: OrderStatus) {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'i')
      .leftJoinAndSelect('i.product', 'p')
      .leftJoinAndSelect('i.variant', 'v')
      .leftJoinAndSelect('o.customer', 'c')
      .where('o.tenant_id = :tenantId', { tenantId })
      .orderBy('o.created_at', 'DESC');

    if (status) qb.andWhere('o.status = :status', { status });
    return qb.getMany();
  }

  async findById(tenantId: string, id: string) {
    const order = await this.orderRepo.findOne({
      where: { id, tenantId },
      relations: ['items', 'items.product', 'items.variant', 'customer'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(tenantId: string, userId: string, dto: {
    customerId?: string;
    items: Array<{ productId: string; variantId?: string; quantity: number; price: number }>;
    deadlineAt?: string;
    address?: string;
    comment?: string;
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const totalAmount = dto.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
      const order = queryRunner.manager.create(Order, {
        tenantId,
        orderNumber: `ORD-${Date.now()}`,
        customerId: dto.customerId,
        status: OrderStatus.NEW,
        deadlineAt: dto.deadlineAt ? new Date(dto.deadlineAt) : undefined,
        address: dto.address,
        comment: dto.comment,
        totalAmount,
        createdBy: userId,
      });
      await queryRunner.manager.save(order);

      for (const item of dto.items) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          tenantId,
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();
      return this.findById(tenantId, order.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(tenantId: string, id: string, status: OrderStatus) {
    const order = await this.findById(tenantId, id);
    order.status = status;
    return this.orderRepo.save(order);
  }
}
