import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../src/schema/User.schema';
import { UserModule } from '../src/user/user.module';
import { ProductModule } from '../src/product/product.module';
import { OrderModule } from '../src/order/order.module';
import { RatingModule } from '../src/rating/rating.module';
import { AuthModule } from '../src/auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,
          ConfigModule.forRoot({
              envFilePath: '.env.test.local', // Load environment variables from local file
          }),
          // Connect to MongoDB database using Mongoose
          MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
          // MongooseModule.forFeature() imports the User schema into the MongooseModule.
          MongooseModule.forFeature([
              {
                  name: User.name, // Specify the name of the schema.
                  schema: UserSchema, // Specify the schema itself.
              }
          ]),
          UserModule,
          ProductModule,
          OrderModule,
          RatingModule,
          AuthModule,
      ],

    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .expect(201); // Assuming it returns 201 for successful creation

    expect(response.body).toHaveProperty('username');
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('role');
  });

  it('/users/{id} (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/1')
      .expect(200);

    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });

  it('/users/{id} (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/1')
      .expect(200); // Assuming it returns 200 for successful update

    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });

  it('/users/{id} (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/1')
      .expect(200); // Assuming it returns 200 for successful deletion

    expect(response.body).toEqual("User deleted successfully");
  });

  it('/users (POST) should return 400 if the user already exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .expect(400); // Assuming it returns 400 for duplicate user

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User already exists");
  });

  it('/users (GET) should return 404 if no users are found', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(404); // Assuming it returns 404 for no users found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("No users found");
  });

  it('/users/{id} (GET) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/1')
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User not found");
  });

  it('/users/{id} (PATCH) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/1')
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User not found");
  });

  it('/users/{id} (DELETE) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/1')
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User not found");
  });

});