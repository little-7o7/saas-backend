import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(tenantId: string): Promise<import("./category.entity").Category[]>;
    create(tenantId: string, dto: any): Promise<import("./category.entity").Category>;
}
