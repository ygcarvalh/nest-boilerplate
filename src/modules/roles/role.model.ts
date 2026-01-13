import { Column, DataType, Model, Table } from 'sequelize-typescript';
import type {
  RoleAttributes,
  RoleCreationAttributes,
} from './roles.types';

@Table({
  tableName: 'roles',
  underscored: true,
  paranoid: true,
})
export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
