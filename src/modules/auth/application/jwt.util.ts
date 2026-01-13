import type { StringValue } from '../domain/jwt.types';

const durationPattern = /^\d+(ms|s|m|h|d|w|y)$/;
const digitsOnlyPattern = /^\d+$/;

export function parseExpiresIn(value: string | undefined): number | StringValue | undefined {
  if (!value) {
    return undefined;
  }

  if (digitsOnlyPattern.test(value)) {
    return Number(value);
  }

  if (isStringValue(value)) {
    return value;
  }

  return undefined;
}

function isStringValue(value: string): value is StringValue {
  return durationPattern.test(value);
}
