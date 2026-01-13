import type { z } from 'zod';
import type { HealthStatus } from '../../domain/health.types';
import type { HealthQuerySchema } from './health.schema';

export type HealthQuery = z.infer<typeof HealthQuerySchema>;

export type HealthResponse = HealthStatus & {
  echo: string | null;
};
