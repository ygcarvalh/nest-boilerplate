import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolePermission } from '../permissions/role-permission.model';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, RolePermission]),
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
