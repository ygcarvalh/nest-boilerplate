import type { Optional } from 'sequelize';

export type PasswordResetTokenAttributes = {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  deletedAt?: Date | null;
};

export type PasswordResetTokenCreationAttributes = Optional<
  PasswordResetTokenAttributes,
  'id' | 'usedAt'
>;
