import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../../common/pipes/zod-validation.pipe';
import type { AuthService } from '../../application/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshSchema,
  ResetPasswordSchema,
} from './auth.schema';
import type {
  AuthForgotPasswordResponse,
  AuthLogoutResponse,
  AuthProfileResponse,
  AuthResetPasswordResponse,
  AuthTokensResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RefreshPayload,
  ResetPasswordPayload,
} from './auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginPayload,
  ): Promise<AuthTokensResponse> {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
    });
  }

  @Post('refresh')
  async refresh(
    @Body(new ZodValidationPipe(RefreshSchema)) body: RefreshPayload,
  ): Promise<AuthTokensResponse> {
    const tokens = await this.authService.refresh(body.refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return tokens;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(
    @Request()
    req: { user: { userId: number; email: string } },
  ): AuthProfileResponse {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request()
    req: { user: { userId: number; email: string } },
  ): Promise<AuthLogoutResponse> {
    await this.authService.logout(req.user.userId);
    return { success: true };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema))
    body: ForgotPasswordPayload,
  ): Promise<AuthForgotPasswordResponse> {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema))
    body: ResetPasswordPayload,
  ): Promise<AuthResetPasswordResponse> {
    const ok = await this.authService.resetPassword(body.token, body.password);
    if (!ok) {
      throw new BadRequestException('Invalid or expired token');
    }
    return { success: true };
  }
}
