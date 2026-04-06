import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';
export declare class ProductVariant extends BaseEntity {
    productId: string;
    product: Product;
    color: string;
    grade: string;
    sku: string;
    isActive: boolean;
}
