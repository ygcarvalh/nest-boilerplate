import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../users/users.types';
import { ABILITY_KEY } from './ability.decorator';
import type { AbilityDescriptor } from './ability.types';
import { AbilityService } from './ability.service';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityService: AbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.getAllAndOverride<AbilityDescriptor | undefined>(
      ABILITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!ability) {
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

    return this.abilityService.can(userId, role, ability);
  }
}
