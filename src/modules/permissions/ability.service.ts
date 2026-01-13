import { Injectable } from '@nestjs/common';
import type { UserRole } from '../users/users.types';
import { PermissionsService } from './permissions.service';
import type { AbilityDescriptor } from './ability.types';

@Injectable()
export class AbilityService {
  constructor(private readonly permissionsService: PermissionsService) {}

  async can(
    userId: number,
    role: UserRole,
    ability: AbilityDescriptor,
  ): Promise<boolean> {
    const permission = this.formatPermission(ability);
    return this.permissionsService.hasPermissions(userId, role, [permission]);
  }

  private formatPermission(ability: AbilityDescriptor): string {
    return `${ability.resource}.${ability.action}`;
  }
}
