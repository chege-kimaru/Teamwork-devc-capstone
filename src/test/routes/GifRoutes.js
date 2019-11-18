import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';
import GifService from '../../main/services/GifService';
import EmployeeService from "../../main/services/EmployeeService";


chai.use(chatHttp);
const { expect } = chai;

const EMPLOYEE1_CREDS = {
  email: 'employee1@teamwork.com',
  password: '1234',
};

const EMPLOYEE2_CREDS = {
  email: 'employee2@teamwork.com',
  password: '1234',
};

const test = () => {
  describe('GifRoutes', () => {
    before(async () => {
      await db.destroy();
      await db.initialize();
      await AuthService.initializeAdmin();
      await EmployeeService.initializeEmployees();
    });

    it('Should let employee create a gif', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/gifs')
            .set('Accept', 'multipart/form-data')
            .set('token', token)
            .field('title', 'balloons')
            .attach('image', './testImage.jpg')
            .end((err2, res2) => {
              expect(res2.status).to.equal(201);
              expect(res2.body.data).to.haveOwnProperty('imageurl');
              done();
            });
        });
    });

    it('Should not allow a gif without an image to be created', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .post('/api/v1/gifs')
            .set('Accept', 'multipart/form-data')
            .set('token', token)
            .field('title', 'balloons')
            .end((err2, res2) => {
              expect(res2.status).to.equal(400);
              expect(res2.body).to.haveOwnProperty('error');
              done();
            });
        });
    });

    it('Should not allow an unauthenticated employee to create a gif', (done) => {
      chai.request(app)
        .post('/api/v1/gifs')
        .set('Accept', 'multipart/form-data')
        .field('title', 'balloons')
        .attach('image', './testImage.jpg')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should get specific employees gifs', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .get('/api/v1/gifs/employee/2')
            .set('Accept', 'multipart/form-data')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.be.an('array');
              expect(res2.body.data[0]).to.haveOwnProperty('imageurl');
              done();
            });
        });
    });

    it('Should only let owner of the gif to delete their article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .delete('/api/v1/gifs/1')
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(401);
              expect(res2.body).to.haveOwnProperty('error');
              expect(res2.body.error).to.equal('You are not authorized to delete this gif.');
              done();
            });
        });
    });

    it('Should let employee delete their gif', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          chai.request(app)
            .delete('/api/v1/gifs/1')
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              done();
            });
        });
    });

  });
};

export default test;
