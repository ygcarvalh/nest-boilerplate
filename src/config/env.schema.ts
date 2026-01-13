import { z } from 'zod';

const numberFromString = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return value;
}, z.number());

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
  PORT: numberFromString.optional().default(3000),
  LOG_LEVEL: z.string().optional().default('info'),
  DB_HOST: z.string().optional().default('localhost'),
  DB_PORT: numberFromString.optional().default(5432),
  DB_USER: z.string().optional().default('postgres'),
  DB_PASSWORD: z.string().optional().default('postgres'),
  DB_NAME: z.string().optional().default('nest_boilerplate'),
  DB_LOGGING: z.enum(['true', 'false']).optional().default('false'),
  JWT_SECRET: z.string().min(8).default('changemechangeme'),
  JWT_EXPIRES_IN: z.string().optional().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().optional().default('7d'),
  RESET_TOKEN_TTL_MINUTES: numberFromString.optional().default(30),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>) {
  return EnvSchema.parse(config);
}
