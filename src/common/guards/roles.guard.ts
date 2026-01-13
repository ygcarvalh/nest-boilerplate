import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { UserRole } from '../../modules/users/users.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { role?: UserRole };
    }>();

    const userRole = request.user?.role;
    return userRole ? roles.includes(userRole) : false;
  }
}
