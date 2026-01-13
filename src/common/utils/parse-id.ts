import { BadRequestException } from '@nestjs/common';

export function parseId(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(`Invalid ${label}`);
  }
  return parsed;
}
