import { DataSource } from "typeorm";
import * as path from 'path'


const datasource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT)
    : undefined,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(__dirname, '/entities/**/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '/migrations/*.js')
      : path.join(__dirname, '/migrations/*.ts'),
  ],
  migrationsRun: true,
});

export default datasource;

