import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';
import { RolePermission } from '../permissions/role-permission.model';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(RolePermission)
    private readonly rolePermissionModel: typeof RolePermission,
    private readonly permissionsService: PermissionsService,
  ) {}

  async listRolesWithPermissions() {
    const roles = await this.roleModel.findAll({ order: [['name', 'ASC']] });
    if (roles.length === 0) {
      return [];
    }
    const roleNames = roles.map((role) => role.name);
    const rolePermissions = await this.rolePermissionModel.findAll({
      where: { roleName: roleNames },
    });

    const permissionsByRole = new Map<string, string[]>();
    for (const role of roleNames) {
      permissionsByRole.set(role, []);
    }
    for (const entry of rolePermissions) {
      const list = permissionsByRole.get(entry.roleName);
      if (list) {
        list.push(entry.permissionName);
      }
    }

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: (permissionsByRole.get(role.name) ?? []).sort(),
    }));
  }

  async createRole(name: string, baseRoleId?: number) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new BadRequestException('Role name is required');
    }

    let basePermissions: string[] = [];
    if (baseRoleId) {
      const baseRole = await this.roleModel.findByPk(baseRoleId);
      if (!baseRole) {
        throw new BadRequestException('Base role not found');
      }
      basePermissions = await this.permissionsService.getRolePermissions(
        baseRole.name,
      );
    }

    const role = await this.roleModel.create({ name: trimmed });
    if (basePermissions.length > 0) {
      await this.permissionsService.replaceRolePermissions(
        role.name,
        basePermissions,
      );
    }

    const permissions = await this.permissionsService.getRolePermissions(
      role.name,
    );
    return { id: role.id, name: role.name, permissions };
  }

  async setRolePermissions(roleId: number, permissions: string[]) {
    const role = await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    await this.permissionsService.replaceRolePermissions(
      role.name,
      permissions,
    );
  }
}
