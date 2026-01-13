import { z } from 'zod';

export const UserPermissionOverrideSchema = z.object({
  permission: z.string().min(1),
  allowed: z.boolean(),
});

export const SetUserPermissionsSchema = z.object({
  overrides: z.array(UserPermissionOverrideSchema),
});
