import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseStock } from './warehouse-stock.entity';
export declare class WarehousesService {
    private warehouseRepo;
    private stockRepo;
    constructor(warehouseRepo: Repository<Warehouse>, stockRepo: Repository<WarehouseStock>);
    findAll(tenantId: string): Promise<Warehouse[]>;
    create(tenantId: string, dto: Partial<Warehouse>): Promise<Warehouse>;
    getStock(tenantId: string, warehouseId?: string): Promise<WarehouseStock[]>;
    updateStock(tenantId: string, warehouseId: string, variantId: string, quantity: number): Promise<WarehouseStock>;
    receiveStock(tenantId: string, dto: {
        warehouseId: string;
        items: Array<{
            variantId: string;
            quantity: number;
        }>;
    }): Promise<WarehouseStock[]>;
}
