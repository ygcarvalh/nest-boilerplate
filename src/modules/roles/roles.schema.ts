import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().min(2),
  baseRoleId: z.number().int().positive().optional(),
});

export const SetRolePermissionsSchema = z.object({
  permissions: z.array(z.string().min(1)),
});
