import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('invoices')
@Index(['tenantId', 'invoiceNumber'], { unique: true })
export class Invoice extends BaseEntity {
  @Column({ name: 'invoice_number', unique: false })
  invoiceNumber: string;

  @Column({ name: 'sale_id', nullable: true })
  saleId: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'paid_amount', default: 0 })
  paidAmount: number;

  @Column({ name: 'qr_code', type: 'text', nullable: true })
  qrCode: string;

  @Column({ name: 'public_url', nullable: true })
  publicUrl: string;

  @Column({ name: 'items_snapshot', type: 'jsonb' })
  itemsSnapshot: object;

  @Column({ name: 'sms_sent', default: false })
  smsSent: boolean;

  @Column({ name: 'telegram_sent', default: false })
  telegramSent: boolean;
}
