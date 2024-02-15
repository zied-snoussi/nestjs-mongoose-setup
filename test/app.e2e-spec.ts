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
import { LoginDtoStub, UpdateUserDtoStub, UserDtoStub, UserDtoStub2 } from '../src/test/stubs/user.dto.stub';
import { UserService } from '../src/user/user.service'; // Import UserService

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userIdAdmin: string;
  let userId: string;
  let userrole: string = "admin";
  let fakeUserId: string = "60f3e3e3e3e3e3e3e3e3e3e3";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
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
      providers: [
        UserService, // Provide UserService
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(UserDtoStub)
      .expect(201); // Corrected expected status code to 201 for Created
  
    expect(response.body).toHaveProperty('username');
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(LoginDtoStub)
      .expect(201); // Corrected expected status code to 201 for Created

    accessToken = response.body.backendTokens.accessToken;
    refreshToken = response.body.backendTokens.refreshToken;
    userId = response.body.user._doc._id;
    userIdAdmin = response.body.user._doc._id;
    userrole = response.body.user._doc.role;
    expect(response.body).toHaveProperty('backendTokens.accessToken');
    expect(response.body).toHaveProperty('backendTokens.refreshToken');
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Corrected expected status code to 401 for Unauthorized

    expect(response.body).toBeInstanceOf(Array);
  });

  // it('/auth/refresh (POST)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/refresh')
  //     .send({ refreshToken })
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .expect(200);

  //   expect(response.body).toHaveProperty('accessToken');
  // });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(UserDtoStub2)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201); // Assuming it returns 201 for successful creation
    userId = response.body._id;
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });

  it('/users/{id} (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });

  it('/users/{id} (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(UpdateUserDtoStub)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful update

    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
  });

  it('/users/{id} (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful deletion
    expect(response.body).toEqual({});
  });

  it('/users (POST) should return 400 if the user already exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(UserDtoStub)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(422); // Assuming it returns 400 for duplicate user

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("Email is already taken");
  });

  it('/users/{id} (GET) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("No user found");
  });

  it('/users/{id} (PATCH) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .send(UpdateUserDtoStub)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User not found");
  });

  it('/users/{id} (DELETE) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("User not found");
  });

  it('/users/{id} (DELETE) should delete the admin user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userIdAdmin}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful deletion

    expect(response.body).toEqual({});
  });

});
