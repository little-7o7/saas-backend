import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // Public endpoint — anyone with the link can view invoice
  @Get('public/:invoiceNumber')
  getPublic(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoicesService.findByNumber(invoiceNumber);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@TenantId() tenantId: string) {
    return this.invoicesService.findAll(tenantId);
  }
}
