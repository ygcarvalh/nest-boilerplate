import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Ability } from './ability.decorator';
import { AbilityGuard } from './ability.guard';
import { PermissionsService } from './permissions.service';
import { SetUserPermissionsSchema } from './permissions.schema';
import type {
  PermissionInfo,
  PermissionsUpdateResponse,
  SetUserPermissionsPayload,
  UserPermissionsResponse,
} from './permissions.types';
import { UsersService } from '../users/users.service';
import { parseId } from '../../common/utils/parse-id';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('permissions', 'read')
  @Get()
  async listPermissions(): Promise<PermissionInfo[]> {
    const permissions = await this.permissionsService.listPermissions();
    return permissions.map((permission) => ({
      name: permission.name,
      description: permission.description,
    }));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('users', 'read')
  @Get('users/:userId')
  async getUserPermissions(
    @Param('userId') userId: string,
  ): Promise<UserPermissionsResponse> {
    const parsedUserId = parseId(userId, 'userId');
    const user = await this.usersService.findById(parsedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [effective, overrides] = await Promise.all([
      this.permissionsService.resolvePermissions(parsedUserId, user.role),
      this.permissionsService.getUserOverrides(parsedUserId),
    ]);

    return {
      effective,
      overrides: overrides.map((override) => ({
        permission: override.permissionName,
        allowed: override.allowed,
      })),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('users', 'update')
  @Put('users/:userId')
  async setUserPermissions(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(SetUserPermissionsSchema))
    body: SetUserPermissionsPayload,
  ): Promise<PermissionsUpdateResponse> {
    const parsedUserId = parseId(userId, 'userId');
    const user = await this.usersService.findById(parsedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.permissionsService.replaceUserPermissions(
      parsedUserId,
      body.overrides,
    );
    return { success: true };
  }
}
