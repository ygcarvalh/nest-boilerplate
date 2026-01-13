import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionsService } from './permissions.service';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';
import { UserPermission } from './user-permission.model';
import { PermissionsGuard } from './permissions.guard';
import { UsersModule } from '../users/users.module';
import { PermissionsController } from './permissions.controller';
import { AbilityService } from './ability.service';
import { AbilityGuard } from './ability.guard';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([Permission, RolePermission, UserPermission]),
    UsersModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsGuard, AbilityService, AbilityGuard],
  exports: [PermissionsService, PermissionsGuard, AbilityService, AbilityGuard],
})
export class PermissionsModule {}
