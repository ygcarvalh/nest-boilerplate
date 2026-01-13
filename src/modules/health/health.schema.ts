import { z } from 'zod';

export const HealthQuerySchema = z.object({
  echo: z.string().optional(),
});
