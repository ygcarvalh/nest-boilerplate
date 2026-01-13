import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { PinoLogger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext('HTTP');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { send: (body: unknown) => void };
      send: (body: unknown) => void;
    }>();
    const request = ctx.getRequest<{ method: string; url: string; id?: string }>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isHttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    const payload = {
      statusCode: status,
      path: request.url,
      method: request.method,
      requestId: request.id,
      error: errorResponse,
    };

    if (status >= 500) {
      this.logger.error(payload, 'Unhandled exception');
    } else {
      this.logger.warn(payload, 'Request failed');
    }

    if (response.status) {
      response.status(status).send(payload);
      return;
    }

    response.send(payload);
  }
}
