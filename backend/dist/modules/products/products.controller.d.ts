import { ProductsService } from './products.service';
import type { CreateProductDto, UpdateProductDto } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(tenantId: string, search?: string): Promise<import("./product.entity").Product[]>;
    findOne(tenantId: string, id: string): Promise<import("./product.entity").Product>;
    create(tenantId: string, dto: CreateProductDto): Promise<import("./product.entity").Product>;
    update(tenantId: string, id: string, dto: UpdateProductDto): Promise<import("./product.entity").Product>;
    delete(tenantId: string, id: string): Promise<void>;
    addVariant(tenantId: string, id: string, dto: {
        color?: string;
        grade?: string;
        sku?: string;
    }): Promise<import("./product-variant.entity").ProductVariant>;
}
