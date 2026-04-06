"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AnalyticsService = class AnalyticsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getDashboard(tenantId, from, to) {
        const [revenue, expenses, debts, stockValue, topProducts, colorSales, gradeSales] = await Promise.all([
            this.getRevenue(tenantId, from, to),
            this.getExpenses(tenantId, from, to),
            this.getTotalDebts(tenantId),
            this.getStockValue(tenantId),
            this.getTopProducts(tenantId, from, to),
            this.getSalesByColor(tenantId, from, to),
            this.getSalesByGrade(tenantId, from, to),
        ]);
        return {
            revenue,
            expenses,
            profit: revenue.total - expenses.total,
            debts,
            stockValue,
            topProducts,
            colorSales,
            gradeSales,
        };
    }
    async getRevenue(tenantId, from, to) {
        const result = await this.dataSource.query(`SELECT
        COALESCE(SUM(total_amount), 0) as total,
        COALESCE(SUM(paid_amount), 0) as paid,
        COALESCE(SUM(debt_amount), 0) as debt,
        COUNT(*) as count
       FROM sales
       WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3`, [tenantId, from, to]);
        return result[0];
    }
    async getExpenses(tenantId, from, to) {
        const result = await this.dataSource.query(`SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM expenses
       WHERE tenant_id = $1 AND expense_date BETWEEN $2 AND $3`, [tenantId, from, to]);
        return result[0];
    }
    async getTotalDebts(tenantId) {
        const result = await this.dataSource.query(`SELECT
        COALESCE(SUM(remaining_amount), 0) as total,
        COUNT(*) as count
       FROM debts
       WHERE tenant_id = $1 AND status IN ('open', 'partial')`, [tenantId]);
        return result[0];
    }
    async getStockValue(tenantId) {
        const result = await this.dataSource.query(`SELECT COALESCE(SUM(ws.quantity * p.retail_price), 0) as retail_value,
              COALESCE(SUM(ws.quantity * p.purchase_price), 0) as purchase_value
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1`, [tenantId]);
        return result[0];
    }
    async getTopProducts(tenantId, from, to, limit = 10) {
        return this.dataSource.query(`SELECT p.name, p.sku,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN products p ON p.id = si.product_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
       GROUP BY p.id, p.name, p.sku
       ORDER BY total_revenue DESC
       LIMIT $4`, [tenantId, from, to, limit]);
    }
    async getSalesByColor(tenantId, from, to) {
        return this.dataSource.query(`SELECT pv.color,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN product_variants pv ON pv.id = si.variant_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
         AND pv.color IS NOT NULL
       GROUP BY pv.color
       ORDER BY total_revenue DESC`, [tenantId, from, to]);
    }
    async getSalesByGrade(tenantId, from, to) {
        return this.dataSource.query(`SELECT pv.grade,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN product_variants pv ON pv.id = si.variant_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
         AND pv.grade IS NOT NULL
       GROUP BY pv.grade
       ORDER BY total_revenue DESC`, [tenantId, from, to]);
    }
    async getStockByColor(tenantId) {
        return this.dataSource.query(`SELECT pv.color, p.name as product_name,
              SUM(ws.quantity) as total_stock
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1 AND pv.color IS NOT NULL
       GROUP BY pv.color, p.id, p.name
       ORDER BY total_stock DESC`, [tenantId]);
    }
    async getStockByGrade(tenantId) {
        return this.dataSource.query(`SELECT pv.grade, p.name as product_name,
              SUM(ws.quantity) as total_stock
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1 AND pv.grade IS NOT NULL
       GROUP BY pv.grade, p.id, p.name
       ORDER BY total_stock DESC`, [tenantId]);
    }
    async getBlackCash(tenantId, from, to) {
        return this.dataSource.query(`SELECT type, period,
              COALESCE(SUM(amount), 0) as total
       FROM black_cash_transactions
       WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY type, period`, [tenantId, from, to]);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map