import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  underscored: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'password_hash',
  })
  declare passwordHash: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'refresh_token_hash',
  })
  declare refreshTokenHash: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login',
  })
  declare lastLogin: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
