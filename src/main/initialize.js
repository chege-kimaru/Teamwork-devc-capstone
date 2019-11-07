import config from 'dotenv';
import db from './utils/db';
import Logger from './utils/logger';
import AuthService from './services/AuthService';

const logger = new Logger().logger();

config.config();

db.destroy()
  .then(() => {
    logger.info('Dropped tables');
    db.initialize().then(() => {
      logger.info('Created tables');
      AuthService.initiateAdmin().then(() => logger.info('Initialized admin')).catch((err) => logger.error(err));
    }).catch((err) => logger.error(err));
  });
