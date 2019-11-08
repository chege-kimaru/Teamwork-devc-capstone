import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';
import EmployeeService from '../../main/services/EmployeeService';


chai.use(chatHttp);
const { expect } = chai;

const EMPLOYEE = {
  email: 'employee@teamwork.com',
  firstName: 'john',
  lastName: 'doe',
  gender: 'MALE',
  jobRole: 'CTO',
  department: 'IT',
  address: '300 Nairobi',
};

const ADMIN_CREDS = {
  email: 'admin@teamwork.com',
  password: '1234',
};

const EMPLOYEE_CREDS = {
  email: 'employee@teamwork.com',
  password: '1234',
};

const test = () => {
  describe('EmployeeRoutes', () => {
    before(async () => {
      await db.destroy();
      await db.initialize();
      await AuthService.initiateAdmin();
    });

    it('Should let admin create a new employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(ADMIN_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/employees')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(EMPLOYEE)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res.body.data).to.haveOwnProperty('id');
              done();
            });
        });
    });

    it('Should not allow incomplete details for employee', (done) => {
      const data = { ...EMPLOYEE };
      delete data.firstName;
      delete data.lastName;
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(ADMIN_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/employees')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(data)
            .end((err2, res2) => {
              expect(res2.status).to.equal(400);
              expect(res2.body).to.haveOwnProperty('error');
              done();
            });
        });
    });

    it('Should not allow non-admin create a new employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/employees')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(EMPLOYEE)
            .end((err, res) => {
              expect(res.status).to.equal(401);
              expect(res.body).to.haveOwnProperty('error');
              done();
            });
        });
    });
  });
};

export default test;
