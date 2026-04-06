import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getDashboard(tenantId: string, from: string, to: string) {
    const [revenue, expenses, debts, stockValue, topProducts, colorSales, gradeSales] =
      await Promise.all([
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

  async getRevenue(tenantId: string, from: string, to: string) {
    const result = await this.dataSource.query(
      `SELECT
        COALESCE(SUM(total_amount), 0) as total,
        COALESCE(SUM(paid_amount), 0) as paid,
        COALESCE(SUM(debt_amount), 0) as debt,
        COUNT(*) as count
       FROM sales
       WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3`,
      [tenantId, from, to],
    );
    return result[0];
  }

  async getExpenses(tenantId: string, from: string, to: string) {
    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM expenses
       WHERE tenant_id = $1 AND expense_date BETWEEN $2 AND $3`,
      [tenantId, from, to],
    );
    return result[0];
  }

  async getTotalDebts(tenantId: string) {
    const result = await this.dataSource.query(
      `SELECT
        COALESCE(SUM(remaining_amount), 0) as total,
        COUNT(*) as count
       FROM debts
       WHERE tenant_id = $1 AND status IN ('open', 'partial')`,
      [tenantId],
    );
    return result[0];
  }

  async getStockValue(tenantId: string) {
    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(ws.quantity * p.retail_price), 0) as retail_value,
              COALESCE(SUM(ws.quantity * p.purchase_price), 0) as purchase_value
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1`,
      [tenantId],
    );
    return result[0];
  }

  async getTopProducts(tenantId: string, from: string, to: string, limit = 10) {
    return this.dataSource.query(
      `SELECT p.name, p.sku,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN products p ON p.id = si.product_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
       GROUP BY p.id, p.name, p.sku
       ORDER BY total_revenue DESC
       LIMIT $4`,
      [tenantId, from, to, limit],
    );
  }

  async getSalesByColor(tenantId: string, from: string, to: string) {
    return this.dataSource.query(
      `SELECT pv.color,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN product_variants pv ON pv.id = si.variant_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
         AND pv.color IS NOT NULL
       GROUP BY pv.color
       ORDER BY total_revenue DESC`,
      [tenantId, from, to],
    );
  }

  async getSalesByGrade(tenantId: string, from: string, to: string) {
    return this.dataSource.query(
      `SELECT pv.grade,
              SUM(si.quantity) as total_qty,
              SUM(si.total_price) as total_revenue
       FROM sale_items si
       JOIN product_variants pv ON pv.id = si.variant_id
       JOIN sales s ON s.id = si.sale_id
       WHERE si.tenant_id = $1 AND s.created_at BETWEEN $2 AND $3
         AND pv.grade IS NOT NULL
       GROUP BY pv.grade
       ORDER BY total_revenue DESC`,
      [tenantId, from, to],
    );
  }

  async getStockByColor(tenantId: string) {
    return this.dataSource.query(
      `SELECT pv.color, p.name as product_name,
              SUM(ws.quantity) as total_stock
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1 AND pv.color IS NOT NULL
       GROUP BY pv.color, p.id, p.name
       ORDER BY total_stock DESC`,
      [tenantId],
    );
  }

  async getStockByGrade(tenantId: string) {
    return this.dataSource.query(
      `SELECT pv.grade, p.name as product_name,
              SUM(ws.quantity) as total_stock
       FROM warehouse_stock ws
       JOIN product_variants pv ON pv.id = ws.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ws.tenant_id = $1 AND pv.grade IS NOT NULL
       GROUP BY pv.grade, p.id, p.name
       ORDER BY total_stock DESC`,
      [tenantId],
    );
  }

  async getBlackCash(tenantId: string, from: string, to: string) {
    return this.dataSource.query(
      `SELECT type, period,
              COALESCE(SUM(amount), 0) as total
       FROM black_cash_transactions
       WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY type, period`,
      [tenantId, from, to],
    );
  }
}
