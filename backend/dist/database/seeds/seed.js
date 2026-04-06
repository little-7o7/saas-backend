"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const subscription_plan_entity_1 = require("../../modules/subscriptions/subscription-plan.entity");
const user_entity_1 = require("../../modules/auth/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'saas_user',
    password: process.env.DB_PASSWORD || 'saas_password',
    database: process.env.DB_NAME || 'saas_db',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('📦 Connected to database');
    const planRepo = AppDataSource.getRepository(subscription_plan_entity_1.SubscriptionPlan);
    const plans = [
        {
            type: subscription_plan_entity_1.PlanType.FREE,
            name: 'Free',
            price: 0,
            maxProducts: 50,
            maxEmployees: 2,
            maxWarehouses: 1,
            smsEnabled: false,
            analyticsEnabled: false,
        },
        {
            type: subscription_plan_entity_1.PlanType.BASIC,
            name: 'Basic',
            price: 99000,
            maxProducts: 500,
            maxEmployees: 10,
            maxWarehouses: 3,
            smsEnabled: true,
            analyticsEnabled: false,
        },
        {
            type: subscription_plan_entity_1.PlanType.PRO,
            name: 'Pro',
            price: 299000,
            maxProducts: 99999,
            maxEmployees: 100,
            maxWarehouses: 20,
            smsEnabled: true,
            analyticsEnabled: true,
        },
    ];
    for (const planData of plans) {
        const existing = await planRepo.findOne({ where: { type: planData.type } });
        if (!existing) {
            await planRepo.save(planRepo.create(planData));
            console.log(`✅ Created plan: ${planData.name}`);
        }
        else {
            console.log(`⏭️  Plan exists: ${planData.name}`);
        }
    }
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const existingAdmin = await userRepo.findOne({ where: { role: user_entity_1.UserRole.SUPER_ADMIN } });
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('admin123', 12);
        await userRepo.save(userRepo.create({
            name: 'Super Admin',
            phone: '+998000000000',
            passwordHash,
            role: user_entity_1.UserRole.SUPER_ADMIN,
            tenantId: undefined,
        }));
        console.log('✅ Created super admin (phone: +998000000000, pass: admin123)');
    }
    await AppDataSource.destroy();
    console.log('🎉 Seeding complete!');
}
seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map