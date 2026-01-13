import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import type { UserRole } from '../users/users.types';
import { RolePermission } from './role-permission.model';
import { UserPermission } from './user-permission.model';
import { Permission } from './permission.model';
import type { Permission as PermissionName } from './permissions.types';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(RolePermission)
    private readonly rolePermissionModel: typeof RolePermission,
    @InjectModel(UserPermission)
    private readonly userPermissionModel: typeof UserPermission,
    @InjectModel(Permission)
    private readonly permissionModel: typeof Permission,
  ) {}

  async resolvePermissions(
    userId: number,
    role: UserRole,
  ): Promise<PermissionName[]> {
    const [rolePermissions, userPermissions] = await Promise.all([
      this.rolePermissionModel.findAll({ where: { roleName: role } }),
      this.userPermissionModel.findAll({ where: { userId } }),
    ]);

    const effective = new Set<PermissionName>(
      rolePermissions.map((entry) => entry.permissionName),
    );

    for (const override of userPermissions) {
      if (override.allowed) {
        effective.add(override.permissionName);
      } else {
        effective.delete(override.permissionName);
      }
    }

    return [...effective];
  }

  async hasPermissions(
    userId: number,
    role: UserRole,
    required: PermissionName[],
  ): Promise<boolean> {
    const effective = await this.resolvePermissions(userId, role);
    if (effective.includes('*')) {
      return true;
    }
    return required.every((permission) => effective.includes(permission));
  }

  async listPermissions(): Promise<Permission[]> {
    return this.permissionModel.findAll({ order: [['name', 'ASC']] });
  }

  async getRolePermissions(roleName: string): Promise<PermissionName[]> {
    const rows = await this.rolePermissionModel.findAll({
      where: { roleName },
    });
    return rows.map((row) => row.permissionName);
  }

  async replaceRolePermissions(
    roleName: string,
    permissions: PermissionName[],
  ): Promise<void> {
    await this.assertPermissionsExist(permissions);
    await this.rolePermissionModel.destroy({ where: { roleName } });
    if (permissions.length === 0) {
      return;
    }
    await this.rolePermissionModel.bulkCreate(
      permissions.map((permissionName) => ({
        roleName,
        permissionName,
      })),
    );
  }

  async replaceUserPermissions(
    userId: number,
    overrides: { permission: PermissionName; allowed: boolean }[],
  ): Promise<void> {
    const permissions = overrides.map((override) => override.permission);
    await this.assertPermissionsExist(permissions);
    await this.userPermissionModel.destroy({ where: { userId } });
    if (overrides.length === 0) {
      return;
    }
    await this.userPermissionModel.bulkCreate(
      overrides.map((override) => ({
        userId,
        permissionName: override.permission,
        allowed: override.allowed,
      })),
    );
  }

  async getUserOverrides(userId: number): Promise<UserPermission[]> {
    return this.userPermissionModel.findAll({ where: { userId } });
  }

  private async assertPermissionsExist(
    permissions: PermissionName[],
  ): Promise<void> {
    const unique = [...new Set(permissions.filter(Boolean))];
    if (unique.length === 0) {
      return;
    }
    const rows = await this.permissionModel.findAll({
      where: { name: unique },
    });
    const existing = new Set(rows.map((row) => row.name));
    const missing = unique.filter((name) => !existing.has(name));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Unknown permissions: ${missing.join(', ')}`,
      );
    }
  }
}
