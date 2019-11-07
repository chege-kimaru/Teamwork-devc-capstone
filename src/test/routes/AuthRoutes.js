import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';

chai.use(chatHttp);
const { expect } = chai;

const test = () => {
  beforeEach(async () => {
    await db.destroy();
    await db.initialize();
    await AuthService.initiateAdmin();
  });

  describe('AuthRoutes', () => {
    it('should sign in a user with correct credentials', (done) => {
      const creds = {
        email: 'admin@teamwork.com',
        password: '1234',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(creds)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            id: 1,
            email: creds.email,
          });
          expect(res.body.data).to.haveOwnProperty('token');
          done();
        });
    });

    it('should not sign in a user with wrong credentials', (done) => {
      const creds = {
        email: 'admin@teamwork.com',
        password: '123456',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(creds)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
  });
};

export default test;
