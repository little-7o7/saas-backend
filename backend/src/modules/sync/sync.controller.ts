import { Controller, Post, Get, Body, Query, UseGuards, Headers } from '@nestjs/common';
import { SyncService, SyncChangeDto } from './sync.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  push(
    @TenantId() tenantId: string,
    @Headers('x-device-id') deviceId: string,
    @Body() body: { changes: SyncChangeDto[] },
  ) {
    return this.syncService.push(tenantId, deviceId || 'unknown', body.changes);
  }

  @Get('pull')
  pull(
    @TenantId() tenantId: string,
    @Headers('x-device-id') deviceId: string,
    @Query('lastSync') lastSync: string,
  ) {
    return this.syncService.pull(tenantId, deviceId || 'unknown', lastSync);
  }

  @Get('status')
  status(@TenantId() tenantId: string) {
    return this.syncService.getStatus(tenantId);
  }
}
