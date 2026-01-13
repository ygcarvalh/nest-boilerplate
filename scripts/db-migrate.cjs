const { Client } = require('pg');
const { spawn } = require('node:child_process');

async function ensureDatabase() {
  const dbName = process.env.DB_NAME ?? 'nest_boilerplate';
  const host = process.env.DB_HOST ?? 'localhost';
  const port = Number(process.env.DB_PORT ?? 5432);
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? 'postgres';

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  try {
    await client.connect();
  } catch (error) {
    console.error(
      `Unable to connect to Postgres at ${host}:${port}. Ensure the database is running or set DB_HOST/DB_PORT.`,
    );
    console.error('Tip: docker compose up -d db');
    throw error;
  }

  const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }

  await client.end();
}

async function runMigrations() {
  await ensureDatabase();

  await new Promise((resolve, reject) => {
    const child = spawn('npx', ['sequelize-cli', 'db:migrate'], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`sequelize-cli exited with code ${code}`));
    });
  });
}

runMigrations().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
