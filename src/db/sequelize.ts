import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'debank',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  ssl: true,
});
