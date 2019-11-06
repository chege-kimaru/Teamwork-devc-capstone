/**
 * Setup .env
 */
import config from 'dotenv';

import dbTests from './db';

config.config();

dbTests();
