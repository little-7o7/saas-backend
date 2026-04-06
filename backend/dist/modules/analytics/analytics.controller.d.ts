import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    dashboard(tenantId: string, from?: string, to?: string): Promise<{
        revenue: any;
        expenses: any;
        profit: number;
        debts: any;
        stockValue: any;
        topProducts: any;
        colorSales: any;
        gradeSales: any;
    }>;
    revenue(tenantId: string, from: string, to: string): Promise<any>;
    salesByColor(tenantId: string, from: string, to: string): Promise<any>;
    salesByGrade(tenantId: string, from: string, to: string): Promise<any>;
    stockByColor(tenantId: string): Promise<any>;
    stockByGrade(tenantId: string): Promise<any>;
    blackCash(tenantId: string, from: string, to: string): Promise<any>;
}
