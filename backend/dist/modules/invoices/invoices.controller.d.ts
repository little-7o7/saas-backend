import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    getPublic(invoiceNumber: string): Promise<import("./invoice.entity").Invoice>;
    findAll(tenantId: string): Promise<import("./invoice.entity").Invoice[]>;
}
