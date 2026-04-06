import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, User } from '../auth/user.entity';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.employeesService.findAll(tenantId);
  }

  @Post()
  create(@TenantId() tenantId: string, @Body() dto: any) {
    return this.employeesService.create(tenantId, dto);
  }

  @Put(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.employeesService.update(tenantId, id, dto);
  }

  @Post(':id/workdays')
  addWorkday(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.employeesService.addWorkday(tenantId, id, dto);
  }

  @Post(':id/advances')
  addAdvance(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: any,
    @CurrentUser() user: User,
  ) {
    return this.employeesService.addAdvance(tenantId, id, { ...dto, createdBy: user.id });
  }

  @Get(':id/salary')
  salaryReport(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.employeesService.getSalaryReport(tenantId, id, from, to);
  }
}
