import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './Middleware/logger.middleware';
import helmet from 'helmet';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use('/uploads', express.static('./src/uploads'));
  app.use(logger);
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
