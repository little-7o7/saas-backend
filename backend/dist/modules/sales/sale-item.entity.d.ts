import { BaseEntity } from '../../common/entities/base.entity';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';
import { ProductVariant } from '../products/product-variant.entity';
export declare class SaleItem extends BaseEntity {
    saleId: string;
    sale: Sale;
    productId: string;
    product: Product;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
