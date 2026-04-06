import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { WarehouseStock } from '../warehouses/warehouse-stock.entity';
import { Customer } from '../customers/customer.entity';
import { Debt, DebtStatus } from '../debts/debt.entity';
import { InvoicesService } from '../invoices/invoices.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SmsService } from '../notifications/sms.service';
import { Tenant } from '../tenants/tenant.entity';

export interface SaleItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  warehouseId?: string;
}

export interface CreateSaleDto {
  customerId?: string;
  items: SaleItemDto[];
  paidAmount: number;
  paymentType?: string;
  comment?: string;
  warehouseId?: string;
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private saleItemRepo: Repository<SaleItem>,
    @InjectRepository(WarehouseStock) private stockRepo: Repository<WarehouseStock>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Debt) private debtRepo: Repository<Debt>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private invoicesService: InvoicesService,
    private notificationsService: NotificationsService,
    private smsService: SmsService,
    private dataSource: DataSource,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const totalAmount = dto.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
      const paidAmount = Math.min(dto.paidAmount, totalAmount);
      const debtAmount = totalAmount - paidAmount;

      const sale = queryRunner.manager.create(Sale, {
        tenantId,
        saleNumber: `S-${Date.now()}`,
        customerId: dto.customerId,
        totalAmount,
        paidAmount,
        debtAmount,
        paymentType: dto.paymentType as any,
        comment: dto.comment,
        warehouseId: dto.warehouseId,
        createdBy: userId,
      });
      await queryRunner.manager.save(sale);

      for (const item of dto.items) {
        const saleItem = queryRunner.manager.create(SaleItem, {
          tenantId,
          saleId: sale.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        });
        await queryRunner.manager.save(saleItem);

        if (item.variantId && item.warehouseId) {
          const stock = await queryRunner.manager.findOne(WarehouseStock, {
            where: {
              tenantId,
              warehouseId: item.warehouseId,
              variantId: item.variantId,
            },
          });
          if (stock) {
            stock.quantity = Number(stock.quantity) - item.quantity;
            await queryRunner.manager.save(stock);
          }
        }
      }

      if (debtAmount > 0 && dto.customerId) {
        const customer = await queryRunner.manager.findOne(Customer, {
          where: { id: dto.customerId, tenantId },
        });

        if (customer) {
          const debt = queryRunner.manager.create(Debt, {
            tenantId,
            customerId: dto.customerId,
            saleId: sale.id,
            originalAmount: debtAmount,
            remainingAmount: debtAmount,
            status: DebtStatus.OPEN,
          });
          await queryRunner.manager.save(debt);

          customer.totalDebt = Number(customer.totalDebt) + debtAmount;

          if (Number(customer.creditLimit) > 0 && Number(customer.totalDebt) > Number(customer.creditLimit)) {
            // Only warn, do not block
          }

          await queryRunner.manager.save(customer);
        }
      }

      await queryRunner.commitTransaction();

      const fullSale = await this.saleRepo.findOne({
        where: { id: sale.id },
        relations: ['items', 'items.product', 'items.variant', 'customer'],
      });

      const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
      const customer = dto.customerId
        ? await this.customerRepo.findOne({ where: { id: dto.customerId, tenantId } })
        : null;

      await this.invoicesService.create({
        tenantId,
        saleId: sale.id,
        customerId: dto.customerId,
        customerName: customer?.name,
        totalAmount,
        paidAmount,
        items: fullSale?.items ?? [],
        storeName: tenant?.name ?? '',
        storePhone: tenant?.phone ?? '',
        customerPhone: customer?.phone,
        customerTelegramId: customer?.telegramChatId,
      });

      return fullSale as Sale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(tenantId: string, from?: string, to?: string) {
    const qb = this.saleRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.items', 'i')
      .leftJoinAndSelect('i.product', 'p')
      .leftJoinAndSelect('i.variant', 'v')
      .leftJoinAndSelect('s.customer', 'c')
      .where('s.tenant_id = :tenantId', { tenantId })
      .orderBy('s.created_at', 'DESC');

    if (from) qb.andWhere('s.created_at >= :from', { from });
    if (to) qb.andWhere('s.created_at <= :to', { to });

    return qb.getMany();
  }

  async findById(tenantId: string, id: string) {
    const sale = await this.saleRepo.findOne({
      where: { id, tenantId },
      relations: ['items', 'items.product', 'items.variant', 'customer'],
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }
}
