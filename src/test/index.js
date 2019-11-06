/**
 * Setup .env
 */
import config from 'dotenv';
config.config();

import dbTests from './db';

dbTests();
