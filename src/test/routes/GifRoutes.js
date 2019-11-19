import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';
import EmployeeService from '../../main/services/EmployeeService';


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

const ADMIN_CREDS = {
  email: 'admin@teamwork.com',
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

              chai.request(app)
                .post('/api/v1/gifs')
                .set('Accept', 'multipart/form-data')
                .set('token', token)
                .field('title', 'balloons')
                .attach('image', './testImage.jpg')
                .end((err3, res3) => {
                  expect(res3.status).to.equal(201);
                  expect(res3.body.data).to.haveOwnProperty('imageurl');
                  done();
                });
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

    it('Should get all gifs latest first', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .get('/api/v1/gifs')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.be.an('array');
              expect(res2.body.data[0]).to.haveOwnProperty('title');
              expect(res2.body.data[0]).to.haveOwnProperty('author');
              const date1 = new Date(res2.body.data[0].createdat);
              const date2 = new Date(res2.body.data[1].createdat);
              expect(date1).to.be.greaterThan(date2);
              done();
            });
        });
    });

    it('Should only allow authorized employees to comment on a gif', (done) => {
      const comment = {
        comment: 'Nice',
      };
      chai.request(app)
        .post('/api/v1/gifs/2/comments')
        .set('Accept', 'application/json')
        .set('token', 'btbby.bywynb.btebye')
        .send(comment)
        .end((err2, res2) => {
          expect(res2.status).to.equal(401);
          expect(res2.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should let an employee comment on another employee\'s gif', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const { token } = res.body.data;
          const comment = {
            comment: 'Nice',
          };
          chai.request(app)
            .post('/api/v1/gifs/2/comments')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(comment)
            .end((err2, res2) => {
              expect(res2.status).to.equal(201);
              expect(res2.body.data).to.haveOwnProperty('commentm');
              done();
            });
        });
    });

    /**
     * TODO: only signed in employees can flag or unflag 1. comment or 2. article as inappropriate
     */

    it('Should let an employee flag and unflag gif as inappropriate', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .put('/api/v1/gifs/2/inappropriate')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({})
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.equal(true);

              chai.request(app)
                .put('/api/v1/gifs/2/inappropriate')
                .set('Accept', 'application/json')
                .set('token', token)
                .send({})
                .end((err3, res3) => {
                  expect(res3.status).to.equal(200);
                  expect(res3.body.data).to.equal(false);

                  chai.request(app)
                    .put('/api/v1/gifs/2/inappropriate')
                    .set('Accept', 'application/json')
                    .set('token', token)
                    .send({})
                    .end((err4, res4) => {
                      expect(res4.status).to.equal(200);
                      expect(res4.body.data).to.equal(true);
                      done();
                    });

                });
            });
        });
    });

    it('Should let an employee flag and unflag gif comment as inappropriate', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .put('/api/v1/gifs/2/comments/1/inappropriate')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({})
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.equal(true);

              chai.request(app)
                .put('/api/v1/gifs/2/comments/1/inappropriate')
                .set('Accept', 'application/json')
                .set('token', token)
                .send({})
                .end((err3, res3) => {
                  expect(res3.status).to.equal(200);
                  expect(res3.body.data).to.equal(false);

                  chai.request(app)
                    .put('/api/v1/gifs/2/comments/1/inappropriate')
                    .set('Accept', 'application/json')
                    .set('token', token)
                    .send({})
                    .end((err4, res4) => {
                      expect(res4.status).to.equal(200);
                      expect(res4.body.data).to.equal(true);
                      done();
                    });
                });
            });
        });
    });

    it('Should get gif by id and include its comments', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .get('/api/v1/gifs/2')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.be.an('object');
              expect(res2.body.data).to.haveOwnProperty('title');
              expect(res2.body.data).to.haveOwnProperty('comments');
              expect(res2.body.data.comments).to.be.an('array');
              expect(res2.body.data.comments).to.have.length.greaterThan(0);
              done();
            });
        });
    });

    /** TODO: delete 1. article, 2. article comment tests:
     * 2. Non admin test
     * 3. Non inappropriate test
     * */

    it('Should let an admin delete a gif flagged as inappropriate', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(ADMIN_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .delete('/api/v1/gifs/2/inappropriate')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({})
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              done();
            });
        });
    });

    it('Should let an admin delete a gif comment flagged as inappropriate', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(ADMIN_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .delete('/api/v1/gifs/2/comments/1/inappropriate')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({})
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              done();
            });
        });
    });

    it('Should only let owner of the gif to delete their gif', (done) => {
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
