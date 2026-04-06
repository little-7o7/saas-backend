import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/user.entity';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll(@TenantId() tenantId: string) {
    return this.settingsService.getAll(tenantId);
  }

  @Put(':key')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  set(
    @TenantId() tenantId: string,
    @Param('key') key: string,
    @Body() value: object,
  ) {
    return this.settingsService.set(tenantId, key, value);
  }
}
