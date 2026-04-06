import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
export interface CreateProductDto {
    name: string;
    sku?: string;
    categoryId?: string;
    unit?: string;
    purchasePrice: number;
    wholesalePrice: number;
    retailPrice: number;
    description?: string;
    variants?: Array<{
        color?: string;
        grade?: string;
        sku?: string;
    }>;
}
export interface UpdateProductDto extends Partial<CreateProductDto> {
}
export declare class ProductsService {
    private productRepo;
    private variantRepo;
    private dataSource;
    constructor(productRepo: Repository<Product>, variantRepo: Repository<ProductVariant>, dataSource: DataSource);
    create(tenantId: string, dto: CreateProductDto): Promise<Product>;
    findAll(tenantId: string, search?: string): Promise<Product[]>;
    findById(tenantId: string, id: string): Promise<Product>;
    update(tenantId: string, id: string, dto: UpdateProductDto): Promise<Product>;
    delete(tenantId: string, id: string): Promise<void>;
    addVariant(tenantId: string, productId: string, dto: {
        color?: string;
        grade?: string;
        sku?: string;
    }): Promise<ProductVariant>;
}
