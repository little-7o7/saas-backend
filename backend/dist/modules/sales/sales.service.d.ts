import { Repository, DataSource } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { WarehouseStock } from '../warehouses/warehouse-stock.entity';
import { Customer } from '../customers/customer.entity';
import { Debt } from '../debts/debt.entity';
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
export declare class SalesService {
    private saleRepo;
    private saleItemRepo;
    private stockRepo;
    private customerRepo;
    private debtRepo;
    private tenantRepo;
    private invoicesService;
    private notificationsService;
    private smsService;
    private dataSource;
    constructor(saleRepo: Repository<Sale>, saleItemRepo: Repository<SaleItem>, stockRepo: Repository<WarehouseStock>, customerRepo: Repository<Customer>, debtRepo: Repository<Debt>, tenantRepo: Repository<Tenant>, invoicesService: InvoicesService, notificationsService: NotificationsService, smsService: SmsService, dataSource: DataSource);
    create(tenantId: string, userId: string, dto: CreateSaleDto): Promise<Sale>;
    findAll(tenantId: string, from?: string, to?: string): Promise<Sale[]>;
    findById(tenantId: string, id: string): Promise<Sale>;
}
