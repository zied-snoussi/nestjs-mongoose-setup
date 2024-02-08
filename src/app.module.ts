import { Module } from '@nestjs/common'; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from '@nestjs/mongoose'; // Import the MongooseModule from the @nestjs/mongoose library.
import { ConfigModule } from '@nestjs/config'; // Import the ConfigModule from the @nestjs/config library.
import { UsersModule } from './users/users.module'; // Import the UsersModule from the users folder.
// The AppModule is the root module of the application.
@Module({
  // The ConfigModule.forRoot() method is used to import environment variables from the .env.development.local file.
  imports: [
    // The ConfigModule.forRoot() method is used to import environment variables from the .env.development.local file.
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
    }),
    // The MongooseModule.forRoot() method is used to connect to the MongoDB database.
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
    // The UsersModule is imported into the AppModule.
    UsersModule,
  ],
  controllers: [],
  providers: [],
})

// The AppModule class is the root module of the application.
export class AppModule { }
