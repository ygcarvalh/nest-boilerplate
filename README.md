# Nest Boilerplate

Opinionated NestJS boilerplate using Fastify, Sequelize (Postgres), JWT auth, Zod validation, Pino logging, Biome, Vitest, and Docker. This setup is aimed at study/portfolio use and defaults to a development workflow.

## Features

- Fastify adapter with Pino logging and request/response log tags
- Sequelize + migrations + seeders (PostgreSQL)
- JWT access + refresh tokens, logout, and password reset flow
- Zod validation pipe and env validation
- Swagger docs at `/docs`
- Health check with database connectivity
- Clean architecture layering per module (`application`, `domain`, `infrastructure`, `presentation`)
- Correlation ID support (`x-correlation-id`)
- Docker + docker-compose for API and Postgres (dev first)

## Requirements

- Node.js 20+
- pnpm 9+
- Docker (optional for local Postgres)

## Project setup

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env` and adjust values.

## Architecture

Each feature module follows clean architecture folders:

```text
src/modules/<feature>/
  application/
  domain/
  infrastructure/
  presentation/
  <feature>.module.ts
```

## Running the app

```bash
# development
pnpm start:dev

# production (optional, if you need it later)
pnpm build
pnpm start:prod
```

## Docker (dev-first)

```bash
# dev container with hot reload
docker compose up -d --build
```

## Database

The `db:migrate` script creates the database (if missing) and runs migrations.

```bash
pnpm db:migrate
pnpm db:seed

# additional helpers
pnpm db:status
pnpm db:reset
pnpm db:seed:undo
pnpm db:migrate:undo
```

## Testing

```bash
pnpm test
pnpm test:cov
```

## Lint and format

```bash
pnpm lint
pnpm lint:ci
pnpm format
```

E2E tests with Testcontainers (requires Docker):

```bash
RUN_E2E_TESTS=true pnpm test
```

## API Endpoints

- `GET /health`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Swagger UI: `http://localhost:3000/docs`

## Default Seed User

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `admin123`

## Notes

- IDs are auto-incrementing `BIGINT`.
- All tables use soft deletes (`paranoid`) with `deleted_at`.

## License

MIT

## Author

Ygor Carvalho (@ygcarvalh)
