import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import pg from 'pg';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialectModule: pg,
      dialect: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'nest_boilerplate',
      autoLoadModels: true,
      synchronize: false,
      logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    }),
  ],
})
export class DatabaseModule {}
