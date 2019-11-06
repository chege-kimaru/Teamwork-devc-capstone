import config from 'dotenv';
import db from './utils/db';
import Logger from './utils/logger';

const logger = new Logger().logger();

config.config();

db.destroy()
  .then(() => {
    logger.info('Dropped tables');
    db.initialize().then(() => {
      logger.info('Created tables');
      // TODO: initialize admin
    });
  });
