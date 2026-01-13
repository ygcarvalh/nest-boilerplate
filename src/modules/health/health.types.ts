import { z } from 'zod';
import { HealthQuerySchema } from './health.schema';

export type HealthQuery = z.infer<typeof HealthQuerySchema>;

export type HealthStatus = {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
};

export type HealthResponse = HealthStatus & {
  echo: string | null;
};
