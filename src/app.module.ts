import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.schema';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        autoLogging: false,
        serializers: {
          req(req) {
            const verbose = process.env.LOG_VERBOSE === 'true';
            return verbose ? req : undefined;
          },
          res(res) {
            const verbose = process.env.LOG_VERBOSE === 'true';
            return verbose ? res : undefined;
          },
        },
        formatters: {
          bindings(bindings) {
            const verbose = process.env.LOG_VERBOSE === 'true';
            if (verbose) {
              return bindings;
            }
            const { req, res, ...rest } = bindings;
            return rest;
          },
          log(log) {
            const verbose = process.env.LOG_VERBOSE === 'true';
            if (verbose) {
              return log;
            }
            const { req, res, ...rest } = log;
            return rest;
          },
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          remove: true,
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req,res,context',
            messageFormat: '{msg}',
          },
        },
      },
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
