import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import type {
  UserPermissionAttributes,
  UserPermissionCreationAttributes,
} from './permissions.types';
import { User } from '../users/user.model';


@Table({
  tableName: 'user_permissions',
  underscored: true,
  paranoid: true,
})
export class UserPermission extends Model<
  UserPermissionAttributes,
  UserPermissionCreationAttributes
> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'permission_name',
  })
  declare permissionName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare allowed: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
