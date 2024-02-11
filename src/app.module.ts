import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { RatingModule } from './rating/rating.module';

// The AppModule class is the root module of the application.
@Module({
  // Import configuration module for environment variables
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local', // Load environment variables from local file
    }),
    // Connect to MongoDB database using Mongoose
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
    // Import feature modules
    UserModule,
    ProductModule,
    OrderModule,
    RatingModule,
  ],
  controllers: [], // No controllers are defined in the root module
  providers: [],   // No providers are defined in the root module
})
export class AppModule { }
