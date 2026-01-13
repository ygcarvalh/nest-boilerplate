import fastifyCors from '@fastify/cors';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { resolveRequestId } from './common/http/request-id';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      genReqId: resolveRequestId,
    }),
  );
  app.useLogger(app.get(Logger));
  const pinoLogger = await app.resolve(PinoLogger);
  app.useGlobalInterceptors(new RequestLoggingInterceptor(pinoLogger));
  app.useGlobalFilters(new HttpExceptionFilter(pinoLogger));
  await app.register(fastifyCors, {
    origin: true,
    credentials: false,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Boilerplate')
    .setDescription('API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  await app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' });
}
bootstrap();
