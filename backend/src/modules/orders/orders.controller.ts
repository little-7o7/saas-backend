import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';
import { User } from '../auth/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@TenantId() tenantId: string, @Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(tenantId, status);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.ordersService.findById(tenantId, id);
  }

  @Post()
  create(@TenantId() tenantId: string, @CurrentUser() user: User, @Body() dto: any) {
    return this.ordersService.create(tenantId, user.id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(tenantId, id, dto.status);
  }
}
