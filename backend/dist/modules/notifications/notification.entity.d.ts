import { BaseEntity } from '../../common/entities/base.entity';
export declare enum NotificationType {
    SMS = "sms",
    TELEGRAM = "telegram"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed"
}
export declare class Notification extends BaseEntity {
    type: NotificationType;
    recipient: string;
    message: string;
    status: NotificationStatus;
    sentAt: Date;
    errorMessage: string;
    referenceType: string;
    referenceId: string;
}
