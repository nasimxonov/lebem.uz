import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const uploadDir = join(__dirname, '..', 'uploads');

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  app.useStaticAssets(uploadDir, {
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
    .build();

    
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
