// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'chai/register-should';
import AuthService from '../../main/services/AuthService';
import db from '../../main/utils/db';

const { expect, assert } = chai;

const test = () => {
  before(async () => {
    await db.destroy();
    await db.initialize();
  });

  // eslint-disable-next-line no-undef
  describe('AuthService', () => {
    // eslint-disable-next-line no-undef
    it('should create default admin', async () => {
      try {
        const data = await AuthService.initiateAdmin();
        expect(data.rows).to.be.an('array');
        expect(data.rows[0]).to.include({
          email: 'admin@teamwork.com',
          role: 1,
        });
      } catch (err) {
        assert.ok(false);
      }
    });
  });
};

export default test;
