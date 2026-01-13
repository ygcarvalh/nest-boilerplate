const common = {
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'nest_boilerplate',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true',
};

module.exports = {
  development: common,
  test: {
    ...common,
    database: process.env.DB_NAME ?? 'nest_boilerplate_test',
  },
  production: common,
};
