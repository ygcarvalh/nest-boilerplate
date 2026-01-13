import { z } from 'zod';
import { UpdateUserRoleSchema } from './users.schema';

export type UserRole = string;

export type UpdateUserRolePayload = z.infer<typeof UpdateUserRoleSchema>;

export type UpdateUserRoleResponse = {
  success: true;
  role: string;
};
