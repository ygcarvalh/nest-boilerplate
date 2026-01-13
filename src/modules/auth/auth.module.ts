import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { parseExpiresIn } from './application/jwt.util';
import { PasswordResetToken } from './infrastructure/persistence/password-reset-token.model';
import { JwtStrategy } from './presentation/guards/jwt.strategy';
import { AuthController } from './presentation/http/auth.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    SequelizeModule.forFeature([PasswordResetToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'changeme',
        signOptions: {
          expiresIn: parseExpiresIn(configService.get<string>('JWT_EXPIRES_IN')),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
