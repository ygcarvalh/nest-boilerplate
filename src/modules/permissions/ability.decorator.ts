import { SetMetadata } from '@nestjs/common';
import type { AbilityDescriptor } from './ability.types';

export const ABILITY_KEY = 'ability';
export const Ability = (resource: string, action: string) =>
  SetMetadata(ABILITY_KEY, { resource, action } satisfies AbilityDescriptor);
