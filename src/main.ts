import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>('ConfigService');
  const port = config.get<number>('app.PORT');
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}

bootstrap();
