import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Bootstrap the Nest application
async function bootstrap() {
  // Create an instance of the Nest application
  const app = await NestFactory.create(AppModule);

  // Configure global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // Start the Nest application
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log("--------------------------------------------------------------------------------------");
  console.log(`Server running on port ${PORT} and you can access the API at http://localhost:${PORT}/api`);
  console.log("--------------------------------------------------------------------------------------");
  console.log(`Swagger documentation available at http://localhost:${PORT}/api`);
  console.log("--------------------------------------------------------------------------------------");
  console.log(`MongoDB connection string: mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`);
  console.log("--------------------------------------------------------------------------------------");

}

// Start the Nest application
bootstrap();
