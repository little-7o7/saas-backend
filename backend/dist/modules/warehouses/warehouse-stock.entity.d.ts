import { BaseEntity } from '../../common/entities/base.entity';
import { Warehouse } from './warehouse.entity';
import { ProductVariant } from '../products/product-variant.entity';
export declare class WarehouseStock extends BaseEntity {
    warehouseId: string;
    warehouse: Warehouse;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    minQuantity: number;
}
