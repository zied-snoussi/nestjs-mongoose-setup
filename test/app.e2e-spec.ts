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
import { UserService } from '../src/user/user.service';

describe('AppController (e2e)', () => {
  let app: INestApplication; // Declare app variable
  let accessToken: string; // Declare accessToken variable
  let refreshToken: string; // Declare refreshToken variable
  let userIdAdmin: string; // Declare userIdAdmin variable
  let userId: string; // Declare userId variable
  let userrole: string = "admin"; // Declare userrole variable
  let fakeUserId: string = "60f3e3e3e3e3e3e3e3e3e3e3"; // Declare fakeUserId variable

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

    app = moduleFixture.createNestApplication(); // Create a new Nest application
    await app.init(); // Initialize the application
  });

  afterEach(async () => {
    await app.close(); // Close the application after each test
  });

  // this test for register should be the first test to run
  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(UserDtoStub)
      .expect(201); // Corrected expected status code to 201 for Created
  
    expect(response.body).toHaveProperty('username'); // Check if response body has username property
  });

// this test for login should be the first test to run
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
    expect(response.body).toHaveProperty('backendTokens.accessToken'); // Check if response body has accessToken property
    expect(response.body).toHaveProperty('backendTokens.refreshToken'); // Check if response body has refreshToken property
  });

  // this test for get should be the last test to run
  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful request

    expect(response.body).toBeInstanceOf(Array); // Check if response body is an instance of Array
  });

 // this test for post should be the last test to run
  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(UserDtoStub2)
      .set('userrole', userrole) // Set the userrole header
      .set('Authorization', `Bearer ${accessToken}`) // Set the Authorization header
      .expect(201); // Assuming it returns 201 for successful creation
    userId = response.body._id;
    expect(response.body).toHaveProperty('username'); // Check if response body has username property
    expect(response.body).toHaveProperty('email'); // Check if response body has email property
    expect(response.body).toHaveProperty('role'); // Check if response body has role property
  });

  // this test for get should be the last test to run
  it('/users/{id} (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful request

    expect(response.body).toHaveProperty('username'); // Check if response body has username property
    expect(response.body).toHaveProperty('email');  // Check if response body has email property
    expect(response.body).toHaveProperty('role'); // Check if response body has role property
  });

  // it('/users/{id} (GET) should return 401 if the user is not authorized', async () => {
  it('/users/{id} (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(UpdateUserDtoStub)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); // Assuming it returns 200 for successful update

    expect(response.body).toHaveProperty('email'); // Check if response body has email property
    expect(response.body).toHaveProperty('role'); // Check if response body has role property
  });

  // this test for delete should be the last test to run
  it('/users/{id} (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`) // Set the Authorization header
      .expect(200); // Assuming it returns 200 for successful deletion
    expect(response.body).toEqual({}); // Check if response body is an empty object
  });

  // this test for post should be the last test to run
  it('/users (POST) should return 400 if the user already exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(UserDtoStub)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(422); // Assuming it returns 422 for user already exists

    expect(response.body).toHaveProperty('message'); // Check if response body has message property
    expect(response.body.message).toEqual("Email is already taken"); // Check if response body has message property
  });

  // this test for get should be the last test to run
  it('/users/{id} (GET) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("No user found"); // Check if response body has message property
  });

  // this test for update should be the last test to run
  it('/users/{id} (PATCH) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .send(UpdateUserDtoStub)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message'); // Check if response body has message property
    expect(response.body.message).toEqual("User not found"); // Check if response body has message property
  });

  // this test for delete should be the last test to run
  it('/users/{id} (DELETE) should return 404 if the user is not found', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${fakeUserId}`)
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`) // Set the Authorization header
      .expect(404); // Assuming it returns 404 for user not found

    expect(response.body).toHaveProperty('message'); // Check if response body has message property
    expect(response.body.message).toEqual("User not found"); // Check if response body has message property
  });

  // this test for delete should be the last test to run
  it('/users/{id} (DELETE) should delete the admin user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userIdAdmin}`) // Delete the admin user
      .set('userrole', userrole)
      .set('Authorization', `Bearer ${accessToken}`) // Set the Authorization header
      .expect(200); // Assuming it returns 200 for successful deletion

    expect(response.body).toEqual({}); // Check if response body is an empty object
  });

});
