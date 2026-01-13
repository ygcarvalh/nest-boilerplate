import { Sequelize } from 'sequelize-typescript';
import { describe, expect, it } from 'vitest';
import { HealthService } from '../../application/health.service';
import { HealthController } from './health.controller';

class TestHealthService extends HealthService {
  constructor() {
    super(
      new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: false,
      }),
    );
  }

  override async getStatus() {
    return { status: 'ok', database: 'up' };
  }
}

describe('HealthController', () => {
  it('returns ok status', async () => {
    const controller = new HealthController(new TestHealthService());
    await expect(controller.getHealth({})).resolves.toEqual({
      status: 'ok',
      database: 'up',
      echo: null,
    });
  });

  it('returns echo when provided', async () => {
    const controller = new HealthController(new TestHealthService());
    await expect(controller.getHealth({ echo: 'pong' })).resolves.toEqual({
      status: 'ok',
      database: 'up',
      echo: 'pong',
    });
  });
});
