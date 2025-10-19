import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { PrismaValidationExceptionFilter } from './common/filters/prisma-exception.filter';
import { setupBullBoard } from './setup-bull-board';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  await setupBullBoard(app);

  const PORT = process.env.PORT ?? 3000;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new PrismaValidationExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const uploadDir = join(__dirname, '..', 'uploads', 'categories');

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setDescription('LebemUz API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Products')
    .addTag('Categories')
    .addTag('Users')
    .addTag('Auth')
    .addServer(`http://localhost:${PORT}`, 'Local environment')
    .addServer('https://lebemuz.duckdns.org', 'Production environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, { swaggerOptions: { persistAuthorization: true } });

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
