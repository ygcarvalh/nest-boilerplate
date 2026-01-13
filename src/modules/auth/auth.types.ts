import { z } from 'zod';
import type { UserRole } from '../users/users.types';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshSchema,
  ResetPasswordSchema,
} from './auth.schema';

export type LoginPayload = z.infer<typeof LoginSchema>;

export type RefreshPayload = z.infer<typeof RefreshSchema>;

export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;

export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthProfileResponse = {
  userId: number;
  email: string;
  role: UserRole;
};

export type AuthLogoutResponse = { success: true };

export type AuthForgotPasswordResponse = {
  requested: true;
  resetToken?: string;
};

export type AuthResetPasswordResponse = { success: true };
