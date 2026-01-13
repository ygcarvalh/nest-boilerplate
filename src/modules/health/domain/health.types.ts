export type HealthStatus = {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
};
