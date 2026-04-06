import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';
import { ProductVariant } from '../products/product-variant.entity';
export declare class OrderItem extends BaseEntity {
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    price: number;
}
