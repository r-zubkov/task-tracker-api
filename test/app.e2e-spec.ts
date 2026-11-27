import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Connection)
      .useValue({
        options: { type: 'mysql' },
        subscribers: [],
        getRepository: () => ({}),
        close: async () => {},
      })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          AUTH_SECRETKEY: 'test-secret',
          AUTH_EXPIRESIN: '60',
        }),
      )
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('rejects an invalid email in POST /auth/sign-in', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'invalid', password: '123456' })
      .expect(400);
  });

  it('requires authentication for GET /users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(401);
  });
});
