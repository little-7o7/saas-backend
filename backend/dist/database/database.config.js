"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (config) => ({
    type: 'postgres',
    host: config.get('DB_HOST', 'localhost'),
    port: config.get('DB_PORT', 5432),
    username: config.get('DB_USER', 'saas_user'),
    password: config.get('DB_PASSWORD', 'saas_password'),
    database: config.get('DB_NAME', 'saas_db'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: true,
    logging: config.get('NODE_ENV') === 'development',
    ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map