import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard(
    @TenantId() tenantId: string,
    @Query('from') from: string = new Date(Date.now() - 30 * 864e5).toISOString(),
    @Query('to') to: string = new Date().toISOString(),
  ) {
    return this.analyticsService.getDashboard(tenantId, from, to);
  }

  @Get('revenue')
  revenue(
    @TenantId() tenantId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getRevenue(tenantId, from, to);
  }

  @Get('sales-by-color')
  salesByColor(
    @TenantId() tenantId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getSalesByColor(tenantId, from, to);
  }

  @Get('sales-by-grade')
  salesByGrade(
    @TenantId() tenantId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getSalesByGrade(tenantId, from, to);
  }

  @Get('stock-by-color')
  stockByColor(@TenantId() tenantId: string) {
    return this.analyticsService.getStockByColor(tenantId);
  }

  @Get('stock-by-grade')
  stockByGrade(@TenantId() tenantId: string) {
    return this.analyticsService.getStockByGrade(tenantId);
  }

  @Get('black-cash')
  blackCash(
    @TenantId() tenantId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.analyticsService.getBlackCash(tenantId, from, to);
  }
}
