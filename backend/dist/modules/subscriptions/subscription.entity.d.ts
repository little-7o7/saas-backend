import { SubscriptionPlan } from './subscription-plan.entity';
export declare enum SubscriptionStatus {
    TRIAL = "trial",
    ACTIVE = "active",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare class Subscription {
    id: string;
    tenantId: string;
    planId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startsAt: Date;
    expiresAt: Date;
    trialEndsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
