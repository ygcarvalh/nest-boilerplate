import { z } from 'zod';
import type { Optional } from 'sequelize';
import { SetUserPermissionsSchema } from './permissions.schema';

export type Permission = string;

export type PermissionInfo = {
  name: string;
  description: string | null;
};

export type UserPermissionOverride = {
  permission: Permission;
  allowed: boolean;
};

export type UserPermissionsResponse = {
  effective: Permission[];
  overrides: UserPermissionOverride[];
};

export type PermissionsUpdateResponse = { success: true };

export type SetUserPermissionsPayload = z.infer<typeof SetUserPermissionsSchema>;

export type RolePermissionAttributes = {
  id: number;
  roleName: string;
  permissionName: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type RolePermissionCreationAttributes = Optional<
  RolePermissionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UserPermissionAttributes = {
  id: number;
  userId: number;
  permissionName: string;
  allowed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type UserPermissionCreationAttributes = Optional<
  UserPermissionAttributes,
  'id' | 'allowed' | 'createdAt' | 'updatedAt'
>;
