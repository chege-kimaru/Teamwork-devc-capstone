/**
 * Setup .env
 */
import config from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'chai/register-should';

import dbTests from './db';
import servicesTests from './services';

config.config();

describe('Teamwork REST API Tests', () => {
  dbTests();
  servicesTests();
});
