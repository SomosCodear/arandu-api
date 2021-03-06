import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}

bootstrap();
