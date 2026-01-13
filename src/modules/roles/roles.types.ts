import { z } from 'zod';
import type { Optional } from 'sequelize';
import { CreateRoleSchema, SetRolePermissionsSchema } from './roles.schema';

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;
export type SetRolePermissionsPayload = z.infer<typeof SetRolePermissionsSchema>;

export type RoleResponse = {
  id: number;
  name: string;
  permissions: string[];
};

export type RoleUpdateResponse = { success: true };

export type RoleAttributes = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type RoleCreationAttributes = Optional<
  RoleAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
