import { Repository } from 'typeorm';
import { Category } from './category.entity';
export declare class CategoriesService {
    private categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findAll(tenantId: string): Promise<Category[]>;
    create(tenantId: string, dto: Partial<Category>): Promise<Category>;
}
