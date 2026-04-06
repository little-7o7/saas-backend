import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators/tenant.decorator';
import { User } from '../auth/user.entity';

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  findAll(@TenantId() tenantId: string, @Query('customerId') customerId?: string) {
    return this.debtsService.findAll(tenantId, customerId);
  }

  @Post(':id/pay')
  payDebt(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: { amount: number; comment?: string },
    @CurrentUser() user: User,
  ) {
    return this.debtsService.payDebt(tenantId, id, dto.amount, user.id, dto.comment);
  }

  @Post('send-reminders')
  sendReminders(@TenantId() tenantId: string) {
    return this.debtsService.sendReminders(tenantId);
  }
}
