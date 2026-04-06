import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepo: Repository<Category>) {}

  findAll(tenantId: string) {
    return this.categoryRepo.find({ where: { tenantId }, order: { name: 'ASC' } });
  }

  create(tenantId: string, dto: Partial<Category>) {
    const cat = this.categoryRepo.create({ ...dto, tenantId });
    return this.categoryRepo.save(cat);
  }
}
