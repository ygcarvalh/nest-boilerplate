import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Ability } from '../permissions/ability.decorator';
import { AbilityGuard } from '../permissions/ability.guard';
import { UpdateUserRoleSchema } from './users.schema';
import type { UpdateUserRolePayload, UpdateUserRoleResponse } from './users.types';
import { UsersService } from './users.service';
import { parseId } from '../../common/utils/parse-id';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @Ability('users', 'update')
  @Put(':userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(UpdateUserRoleSchema))
    body: UpdateUserRolePayload,
  ): Promise<UpdateUserRoleResponse> {
    const parsedUserId = parseId(userId, 'userId');
    const user = await this.usersService.findById(parsedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.usersService.updateRole(parsedUserId, body.role);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return { success: true, role };
  }
}
