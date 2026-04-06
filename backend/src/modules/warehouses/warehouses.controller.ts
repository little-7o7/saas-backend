import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/user.entity';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.warehousesService.findAll(tenantId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@TenantId() tenantId: string, @Body() dto: any) {
    return this.warehousesService.create(tenantId, dto);
  }

  @Get('stock')
  getStock(@TenantId() tenantId: string, @Query('warehouseId') warehouseId?: string) {
    return this.warehousesService.getStock(tenantId, warehouseId);
  }

  @Post('stock/receive')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  receiveStock(@TenantId() tenantId: string, @Body() dto: any) {
    return this.warehousesService.receiveStock(tenantId, dto);
  }
}
