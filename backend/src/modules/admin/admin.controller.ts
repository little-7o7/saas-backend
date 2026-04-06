import {
  Controller, Get, Post, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  stats() {
    return this.adminService.getSystemStats();
  }

  @Get('tenants')
  listTenants(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.adminService.listTenants(+page, +limit);
  }

  @Get('tenants/:id')
  tenantDetails(@Param('id') id: string) {
    return this.adminService.getTenantDetails(id);
  }

  @Post('tenants/:id/block')
  blockTenant(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.blockTenant(id, dto.reason);
  }

  @Post('tenants/:id/unblock')
  unblockTenant(@Param('id') id: string) {
    return this.adminService.unblockTenant(id);
  }

  @Get('audit-logs')
  auditLogs(
    @Query('tenantId') tenantId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.adminService.getAuditLogs(tenantId, +page, +limit);
  }
}
