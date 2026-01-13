import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../../users/infrastructure/persistence/user.model';
import type {
  PasswordResetTokenAttributes,
  PasswordResetTokenCreationAttributes,
} from '../../domain/password-reset-token.types';

@Table({
  tableName: 'password_reset_tokens',
  underscored: true,
  paranoid: true,
})
export class PasswordResetToken extends Model<
  PasswordResetTokenAttributes,
  PasswordResetTokenCreationAttributes
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
    type: DataType.STRING(255),
    allowNull: false,
    field: 'token_hash',
  })
  declare tokenHash: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  declare expiresAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'used_at',
  })
  declare usedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}
