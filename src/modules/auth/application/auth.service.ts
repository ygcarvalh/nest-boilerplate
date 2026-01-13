import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcryptjs';
import type { UsersService } from '../../users/application/users.service';
import { PasswordResetToken } from '../infrastructure/persistence/password-reset-token.model';
import { parseExpiresIn } from './jwt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(PasswordResetToken)
    private readonly passwordResetModel: typeof PasswordResetToken,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return null;
    }

    return user;
  }

  async login(user: { id: number; email: string }) {
    const tokens = await this.issueTokens(user.id, user.email);
    await this.usersService.updateLastLogin(user.id, new Date());
    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: { sub: number; email: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET') ?? 'changeme',
      });
    } catch {
      return null;
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      return null;
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!tokenMatches) {
      return null;
    }

    return this.issueTokens(user.id, user.email);
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  async requestPasswordReset(email: string): Promise<{ requested: true; resetToken?: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return { requested: true };
    }

    const resetToken = this.generateToken();
    const tokenHash = await bcrypt.hash(resetToken, 10);
    const ttlMinutes = this.configService.get<number>('RESET_TOKEN_TTL_MINUTES') ?? 30;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

    await this.passwordResetModel.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      usedAt: null,
    });

    return { requested: true, resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenRecords = await this.passwordResetModel.findAll({
      where: {
        usedAt: null,
      },
    });

    if (tokenRecords.length === 0) {
      return false;
    }

    const now = Date.now();
    let matchingToken: PasswordResetToken | null = null;
    for (const record of tokenRecords) {
      if (record.expiresAt.getTime() < now) {
        continue;
      }
      const matches = await bcrypt.compare(token, record.tokenHash);
      if (matches) {
        matchingToken = record;
        break;
      }
    }

    if (!matchingToken) {
      return false;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(matchingToken.userId, passwordHash);
    await matchingToken.update({ usedAt: new Date() });

    return true;
  }

  private async issueTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: parseExpiresIn(this.configService.get<string>('JWT_EXPIRES_IN')),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: parseExpiresIn(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(userId, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}
