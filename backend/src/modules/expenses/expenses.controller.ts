import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, User } from '../auth/user.entity';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('categories')
  listCategories(@TenantId() tenantId: string) {
    return this.expensesService.findAllCategories(tenantId);
  }

  @Post('categories')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createCategory(@TenantId() tenantId: string, @Body() dto: any) {
    return this.expensesService.createCategory(tenantId, dto);
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.expensesService.findAll(tenantId, from, to);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@TenantId() tenantId: string, @CurrentUser() user: User, @Body() dto: any) {
    return this.expensesService.create(tenantId, { ...dto, createdBy: user.id });
  }
}
