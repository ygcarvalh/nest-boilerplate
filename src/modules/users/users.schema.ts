import { z } from 'zod';

export const UpdateUserRoleSchema = z.object({
  role: z.string().min(1),
});
