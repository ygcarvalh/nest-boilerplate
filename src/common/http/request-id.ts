import crypto from 'node:crypto';
import type { IncomingMessage } from 'node:http';

export function resolveRequestId(req: IncomingMessage): string {
  const correlationId = req.headers['x-correlation-id'];
  if (typeof correlationId === 'string' && correlationId.trim() !== '') {
    return correlationId;
  }
  if (Array.isArray(correlationId) && correlationId.length > 0) {
    const first = correlationId[0];
    if (first && first.trim() !== '') {
      return first;
    }
  }
  return crypto.randomUUID();
}
