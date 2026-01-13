import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { PinoLogger } from 'nestjs-pino';
import { finalize } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{
      method: string;
      url: string;
      query?: Record<string, unknown>;
      id?: string;
    }>();
    const response = httpContext.getResponse<{ statusCode?: number }>();

    const start = Date.now();
    const { method, url } = request;

    this.logger.info(`[INCOMING REQUEST] ${formatIncomingLog(method, url, request.query)}`);

    return next.handle().pipe(
      finalize(() => {
        const durationMs = Date.now() - start;
        const statusCode = response.statusCode ?? 200;

        this.logger.info(
          `[OUTGOING REQUEST] ${formatOutgoingLog(
            method,
            url,
            statusCode,
            durationMs,
            request.query,
          )}`,
        );
      }),
    );
  }
}

function formatIncomingLog(
  method: string,
  url: string,
  query: Record<string, unknown> | undefined,
) {
  const queryPart = formatQuery(query);
  return `${method} ${stripQuery(url)}${queryPart}`;
}

function formatOutgoingLog(
  method: string,
  url: string,
  statusCode: number,
  durationMs: number,
  query: Record<string, unknown> | undefined,
) {
  const queryPart = formatQuery(query);
  return `${method} ${stripQuery(url)}${queryPart} ${statusCode} ${durationMs}ms`;
}

function stripQuery(url: string) {
  const index = url.indexOf('?');
  return index === -1 ? url : url.slice(0, index);
}

function formatQuery(query: Record<string, unknown> | undefined) {
  if (!query || Object.keys(query).length === 0) {
    return '';
  }

  const entries = Object.entries(query).map(([key, value]) => [
    key,
    value == null ? '' : String(value),
  ]);
  const search = new URLSearchParams(entries).toString();
  return search ? `?${search}` : '';
}
