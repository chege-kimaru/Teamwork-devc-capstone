import config from 'dotenv';
import { Pool } from 'pg';
import Logger from './logger';
import db from './dbSql';

config.config();

const logger = new Logger().logger();

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('connected to the db');
});

pool.on('remove', () => {
  logger.info('client removed');
});

const initialize = () => pool.query(db.dbCreateSql);

const destroy = () => pool.query(db.dbDropSql);

export default {
  initialize, destroy, pool,
};
