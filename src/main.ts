import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Emulator swagger api documentation')
    .setDescription('The  API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const Document = SwaggerModule.createDocument(app, options, {
    include: [],
  });
  SwaggerModule.setup('api', app, Document);
  await app.listen(3000);
}
bootstrap();
