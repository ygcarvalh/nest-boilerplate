import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
import { PERMISSIONS_KEY } from './permissions.decorator';
import type { Permission } from './permissions.types';
import type { UserRole } from '../users/users.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { userId?: number; role?: UserRole };
    }>();

    const userId = request.user?.userId;
    const role = request.user?.role;
    if (!userId || !role) {
      return false;
    }

    return this.permissionsService.hasPermissions(userId, role, required);
  }
}
