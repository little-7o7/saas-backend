export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    OWNER = "owner",
    ADMIN = "admin",
    SELLER = "seller"
}
export declare class User {
    id: string;
    tenantId: string;
    name: string;
    phone: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    telegramChatId: string;
    createdAt: Date;
    updatedAt: Date;
}
