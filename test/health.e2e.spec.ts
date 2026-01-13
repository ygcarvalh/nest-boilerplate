import { execFileSync } from 'node:child_process';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';

const describeE2E = process.env.RUN_E2E_TESTS === 'true' ? describe : describe.skip;

describeE2E('Health (e2e)', () => {
  let container: StartedTestContainer;
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const dbUser = 'postgres';
    const dbPassword = 'postgres';
    const dbName = 'nest_boilerplate';

    container = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_USER: dbUser,
        POSTGRES_PASSWORD: dbPassword,
        POSTGRES_DB: dbName,
      })
      .withExposedPorts(5432)
      .start();

    process.env.DB_HOST = container.getHost();
    process.env.DB_PORT = String(container.getMappedPort(5432));
    process.env.DB_USER = dbUser;
    process.env.DB_PASSWORD = dbPassword;
    process.env.DB_NAME = dbName;
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'changemechangeme';

    execFileSync('node', ['scripts/db-migrate.cjs'], {
      stdio: 'inherit',
      env: { ...process.env },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (container) {
      await container.stop();
    }
  });

  it('returns health status', async () => {
    const response = await supertest(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.status).toBeDefined();
  });
});
