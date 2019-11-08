import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';

chai.use(chatHttp);
const { expect } = chai;

const test = () => {
  describe('AuthRoutes', () => {
    before(async () => {
      await db.destroy();
      await db.initialize();
      await AuthService.initiateAdmin();
    });

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

    it('should change the password for authenticated user with correct current password set', (done) => {
      const creds = {
        email: 'admin@teamwork.com',
        password: '1234',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(creds)
        .end((err, res) => {
          const data = {
            currentPassword: '1234',
            password: '123456',
          };
          const { token } = res.body.data;

          chai.request(app)
            .post('/api/v1/auth/change-password')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(data)
            .end((e, r) => {
              expect(r.status).to.equal(200);
              done();
            });
        });
    });

    it('should not change the password for wrong current password set', (done) => {
      const creds = {
        email: 'admin@teamwork.com',
        password: '123456',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(creds)
        .end((err, res) => {
          const data = {
            currentPassword: '12345678',
            password: '123456',
          };
          chai.request(app)
            .post('/api/v1/auth/change-password')
            .set('Accept', 'application/json')
            .set('token', res.body.data.token)
            .send(data)
            .end((e, r) => {
              expect(r.status).to.equal(401);
              done();
            });
        });
    });

    it('should not change the user password for an unauthenticated user', (done) => {
      const data = {
        currentPassword: '123456',
        password: '1234',
      };
      chai.request(app)
        .post('/api/v1/auth/change-password')
        .set('Accept', 'application/json')
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
  });
};

export default test;
