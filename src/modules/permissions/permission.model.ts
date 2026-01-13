import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'permissions',
  underscored: true,
  paranoid: true,
})
export class Permission extends Model<Permission> {
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
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
