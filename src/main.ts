import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* PARA VALIDACIONES */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /* PARA SWAGGER */
  const config = new DocumentBuilder()
    .setTitle('"Leonel Enriquez MediControl API"')
    .setDescription(' Sistema de Gestión de Citas Médicas')
    .setVersion('1.0')
    .addBearerAuth()
    //TODO: Agregar aqui los tags para cada controlador
    .addTag('Auth')
    .addTag('Users')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
