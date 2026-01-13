import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AbilityGuard } from '../permissions/ability.guard';
import { Ability } from '../permissions/ability.decorator';
import { CreateRoleSchema, SetRolePermissionsSchema } from './roles.schema';
import type {
  CreateRolePayload,
  RoleResponse,
  RoleUpdateResponse,
  SetRolePermissionsPayload,
} from './roles.types';
import { RolesService } from './roles.service';
import { parseId } from '../../common/utils/parse-id';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('roles', 'read')
  @Get()
  async listRoles(): Promise<RoleResponse[]> {
    return this.rolesService.listRolesWithPermissions();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('roles', 'create')
  @Post()
  async createRole(
    @Body(new ZodValidationPipe(CreateRoleSchema)) body: CreateRolePayload,
  ): Promise<RoleResponse> {
    return this.rolesService.createRole(body.name, body.baseRoleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('roles', 'update')
  @Put(':roleId/permissions')
  async updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body(new ZodValidationPipe(SetRolePermissionsSchema))
    body: SetRolePermissionsPayload,
  ): Promise<RoleUpdateResponse> {
    const parsedRoleId = parseId(roleId, 'roleId');
    await this.rolesService.setRolePermissions(parsedRoleId, body.permissions);
    return { success: true };
  }
}
