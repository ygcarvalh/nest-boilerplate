import { Column, DataType, Model, Table } from 'sequelize-typescript';
import type {
  RolePermissionAttributes,
  RolePermissionCreationAttributes,
} from './permissions.types';


@Table({
  tableName: 'role_permissions',
  underscored: true,
  paranoid: true,
})
export class RolePermission extends Model<
  RolePermissionAttributes,
  RolePermissionCreationAttributes
> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'role_name',
  })
  declare roleName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'permission_name',
  })
  declare permissionName: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
