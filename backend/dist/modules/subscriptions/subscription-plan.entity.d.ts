export declare enum PlanType {
    FREE = "free",
    BASIC = "basic",
    PRO = "pro"
}
export declare class SubscriptionPlan {
    id: string;
    type: PlanType;
    name: string;
    price: number;
    maxProducts: number;
    maxEmployees: number;
    maxWarehouses: number;
    smsEnabled: boolean;
    analyticsEnabled: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
