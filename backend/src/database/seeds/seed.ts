import { DataSource } from 'typeorm';
import { SubscriptionPlan, PlanType } from '../../modules/subscriptions/subscription-plan.entity';
import { User, UserRole } from '../../modules/auth/user.entity';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
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

  const planRepo = AppDataSource.getRepository(SubscriptionPlan);

  const plans = [
    {
      type: PlanType.FREE,
      name: 'Free',
      price: 0,
      maxProducts: 50,
      maxEmployees: 2,
      maxWarehouses: 1,
      smsEnabled: false,
      analyticsEnabled: false,
    },
    {
      type: PlanType.BASIC,
      name: 'Basic',
      price: 99000,
      maxProducts: 500,
      maxEmployees: 10,
      maxWarehouses: 3,
      smsEnabled: true,
      analyticsEnabled: false,
    },
    {
      type: PlanType.PRO,
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
    } else {
      console.log(`⏭️  Plan exists: ${planData.name}`);
    }
  }

  // Super admin
  const userRepo = AppDataSource.getRepository(User);
  const existingAdmin = await userRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await userRepo.save(userRepo.create({
      name: 'Super Admin',
      phone: '+998000000000',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
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
