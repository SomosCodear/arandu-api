import { registerAs } from '@nestjs/config';

export const typeORMConfig = registerAs('typeorm', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arandu',
}));
