import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import type { CreateProductDto, UpdateProductDto } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/user.entity';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@TenantId() tenantId: string, @Query('search') search?: string) {
    return this.productsService.findAll(tenantId, search);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.findById(tenantId, id);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@TenantId() tenantId: string, @Body() dto: CreateProductDto) {
    return this.productsService.create(tenantId, dto);
  }

  @Put(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productsService.delete(tenantId, id);
  }

  @Post(':id/variants')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  addVariant(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: { color?: string; grade?: string; sku?: string },
  ) {
    return this.productsService.addVariant(tenantId, id, dto);
  }
}
