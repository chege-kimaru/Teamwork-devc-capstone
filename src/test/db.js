// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'chai/register-should';
import db from '../main/utils/db';

const { assert } = chai;

const test = () => {
  // eslint-disable-next-line no-undef
  describe('Creation and dropping of tables', () => {
    // eslint-disable-next-line no-undef
    it('should create and drop tables without error', async () => {
      try {
        await db.destroy();
        await db.initialize();
        assert.ok(true);
      } catch (err) {
        assert.ok(false);
      }
    });
  });
};

export default test;
