import { DataSource } from 'typeorm';
export declare class AnalyticsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getDashboard(tenantId: string, from: string, to: string): Promise<{
        revenue: any;
        expenses: any;
        profit: number;
        debts: any;
        stockValue: any;
        topProducts: any;
        colorSales: any;
        gradeSales: any;
    }>;
    getRevenue(tenantId: string, from: string, to: string): Promise<any>;
    getExpenses(tenantId: string, from: string, to: string): Promise<any>;
    getTotalDebts(tenantId: string): Promise<any>;
    getStockValue(tenantId: string): Promise<any>;
    getTopProducts(tenantId: string, from: string, to: string, limit?: number): Promise<any>;
    getSalesByColor(tenantId: string, from: string, to: string): Promise<any>;
    getSalesByGrade(tenantId: string, from: string, to: string): Promise<any>;
    getStockByColor(tenantId: string): Promise<any>;
    getStockByGrade(tenantId: string): Promise<any>;
    getBlackCash(tenantId: string, from: string, to: string): Promise<any>;
}
