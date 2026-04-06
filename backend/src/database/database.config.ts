import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get('DB_USER', 'saas_user'),
  password: config.get('DB_PASSWORD', 'saas_password'),
  database: config.get('DB_NAME', 'saas_db'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: config.get('NODE_ENV') === 'development',
  ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
});
