import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BlackCashService } from './black-cash.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, User } from '../auth/user.entity';

@Controller('black-cash')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class BlackCashController {
  constructor(private readonly blackCashService: BlackCashService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.blackCashService.findAll(tenantId, from, to);
  }

  @Get('balance')
  getBalance(@TenantId() tenantId: string) {
    return this.blackCashService.getBalance(tenantId);
  }

  @Post()
  create(@TenantId() tenantId: string, @CurrentUser() user: User, @Body() dto: any) {
    return this.blackCashService.create(tenantId, { ...dto, createdBy: user.id });
  }
}
