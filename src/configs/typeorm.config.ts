import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const typeORMConfig = registerAs(
  'typeorm',
  () =>
    <ConnectionOptions>{
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'arandu',
      logging: process.env.DB_LOGGING === 'true',
      entities: [],
    },
);
