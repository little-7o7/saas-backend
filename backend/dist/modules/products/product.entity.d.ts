import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../categories/category.entity';
import { ProductVariant } from './product-variant.entity';
export declare enum UnitType {
    PIECE = "piece",
    METER = "meter",
    KG = "kg",
    LITER = "liter"
}
export declare class Product extends BaseEntity {
    name: string;
    sku: string;
    categoryId: string;
    category: Category;
    unit: UnitType;
    purchasePrice: number;
    wholesalePrice: number;
    retailPrice: number;
    description: string;
    isActive: boolean;
    variants: ProductVariant[];
}
