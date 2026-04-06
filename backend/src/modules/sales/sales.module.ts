import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { WarehouseStock } from '../warehouses/warehouse-stock.entity';
import { Customer } from '../customers/customer.entity';
import { Debt } from '../debts/debt.entity';
import { Tenant } from '../tenants/tenant.entity';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, WarehouseStock, Customer, Debt, Tenant]),
    InvoicesModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
