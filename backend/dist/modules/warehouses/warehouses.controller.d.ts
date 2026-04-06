import { WarehousesService } from './warehouses.service';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    findAll(tenantId: string): Promise<import("./warehouse.entity").Warehouse[]>;
    create(tenantId: string, dto: any): Promise<import("./warehouse.entity").Warehouse>;
    getStock(tenantId: string, warehouseId?: string): Promise<import("./warehouse-stock.entity").WarehouseStock[]>;
    receiveStock(tenantId: string, dto: any): Promise<import("./warehouse-stock.entity").WarehouseStock[]>;
}
