import { Controller, Get, Res } from '@nestjs/common';

import type { Response } from 'express';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}
  @Get('/liveness')
  liveness(@Res() res: Response) {
    res.json({ status: 'ok' });
  }

  @Get('/readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
    ]);
  }
}
