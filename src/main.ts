import { NestFactory } from '@nestjs/core'; // Import the NestFactory class from the @nestjs/core library.
import { AppModule } from './app.module'; // Import the AppModule from the app.module file.
import { ValidationPipe } from '@nestjs/common';
// The bootstrap() function is an asynchronous function that creates an instance of the Nest application.
async function bootstrap() {
  // The NestFactory.create() method is used to create an instance of the Nest application.
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // The app.listen() method is used to start the Nest application on port 5000.
  await app.listen(5000);
}
// Call the bootstrap() function to start the Nest application.
bootstrap();
