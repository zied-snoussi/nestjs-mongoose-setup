import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(201); // Assuming it returns 201 for successful creation
  });

  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  it('/users/{id} (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200);
  });

  it('/users/{id} (PATCH)', async () => {
    return request(app.getHttpServer())
      .patch('/users/1')
      .expect(200); // Assuming it returns 200 for successful update
  });

  it('/users/{id} (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200); // Assuming it returns 200 for successful deletion
  });

});

