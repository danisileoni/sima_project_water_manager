import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const dirname = __dirname;

const config = {
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST,
  port: Number(process.env.DB_POSTGRES_PORT),
  username: process.env.DB_POSTGRES_USER,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_NAME,

  // security
  synchronize: false,
  autoLoadEntities: true,
  migrationsRun: true,
  dropSchema: false,
  keepConnectionAlive: true,

  entities: [dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [dirname + '/../config/db/migrations/*{.ts,.js}'],
};
export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
