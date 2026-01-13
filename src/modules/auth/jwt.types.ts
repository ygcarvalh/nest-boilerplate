import type { UserRole } from '../users/users.types';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
};

export type StringValue = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
