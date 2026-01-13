import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { HealthQuerySchema } from './health.schema';
import type { HealthQuery, HealthResponse } from './health.types';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth(
    @Query(new ZodValidationPipe(HealthQuerySchema)) query: HealthQuery,
  ): Promise<HealthResponse> {
    const status = await this.healthService.getStatus();
    return {
      ...status,
      echo: query.echo ?? null,
    };
  }
}
