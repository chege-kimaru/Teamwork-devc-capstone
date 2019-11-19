import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../../main/app';
import db from '../../main/utils/db';
import AuthService from '../../main/services/AuthService';
import EmployeeService from '../../main/services/EmployeeService';


chai.use(chatHttp);
const {expect} = chai;

const EMPLOYEE1_CREDS = {
  email: 'employee1@teamwork.com',
  password: '1234',
};

const EMPLOYEE2_CREDS = {
  email: 'employee2@teamwork.com',
  password: '1234',
};

const test = () => {
  describe('ArticleRoutes', () => {
    before(async () => {
      await db.destroy();
      await db.initialize();
      await AuthService.initializeAdmin();
      await EmployeeService.initializeEmployees();
    });

    it('Should let employee create an article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const article = {
            title: 'Test title',
            article: 'Test article',
            tags: 'test,tags',
          };
          chai.request(app)
            .post('/api/v1/articles')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(article)
            .end((err2, res2) => {
              expect(res2.status).to.equal(201);
              expect(res2.body.data).to.haveOwnProperty('title');

              chai.request(app)
                .post('/api/v1/articles')
                .set('Accept', 'application/json')
                .set('token', token)
                .send(article)
                .end((err3, res3) => {
                  expect(res3.status).to.equal(201);
                  expect(res3.body.data).to.haveOwnProperty('title');
                  done();
                });
            });
        });
    });

    it('Should let employee create an article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const article = {
            title: 'Test title',
            article: 'Test article',
            tags: 'test,tags',
          };
          chai.request(app)
            .post('/api/v1/articles')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(article)
            .end((err2, res2) => {
              expect(res2.status).to.equal(201);
              expect(res2.body.data).to.haveOwnProperty('title');
              done();
            });
        });
    });

    it('Should not allow an article without a title', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const article = {
            article: 'Test article',
            tags: 'test,tags',
          };
          chai.request(app)
            .post('/api/v1/articles')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(article)
            .end((err2, res2) => {
              expect(res2.status).to.equal(400);
              expect(res2.body).to.haveOwnProperty('error');
              done();
            });
        });
    });

    it('Should not allow an unauthenticated employee to create an article', (done) => {
      const article = {
        title: 'Test title',
        article: 'Test article',
        tags: 'test,tags',
      };
      chai.request(app)
        .post('/api/v1/articles')
        .set('Accept', 'application/json')
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should get specific employees articles', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .get('/api/v1/articles/employee/2')
            .set('Accept', 'multipart/form-data')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.be.an('array');
              expect(res2.body.data[0]).to.haveOwnProperty('title');
              done();
            });
        });
    });

    it('Should get all articles latest first', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .get('/api/v1/articles')
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

    it('Should let employee update their article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const article = {
            title: 'Test title',
            article: 'Test article',
            tags: 'test,tags',
          };
          chai.request(app)
            .put('/api/v1/articles/1')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(article)
            .end((err2, res2) => {
              expect(res2.status).to.equal(200);
              expect(res2.body.data).to.haveOwnProperty('title');
              done();
            });
        });
    });

    it('Should only allow authorized employees to comment', (done) => {
      const comment = {
        comment: 'Nice'
      };
      chai.request(app)
        .post('/api/v1/articles/2/comments')
        .set('Accept', 'application/json')
        .set('token', 'btbby.bywynb.btebye')
        .send(comment)
        .end((err2, res2) => {
          expect(res2.status).to.equal(401);
          expect(res2.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should let an employee comment on another employee\'s article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const comment = {
            comment: 'Nice'
          };
          chai.request(app)
            .post('/api/v1/articles/2/comments')
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

    it('Should only let owner of the article to update their article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          const article = {
            title: 'Test title',
            article: 'Test article',
            tags: 'test,tags',
          };
          chai.request(app)
            .put('/api/v1/articles/1')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(article)
            .end((err2, res2) => {
              expect(res2.status).to.equal(401);
              expect(res2.body).to.haveOwnProperty('error');
              expect(res2.body.error).to.equal('You are not authorized to edit this article.');
              done();
            });
        });
    });

    it('Should only let owner of the article to delete their article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE2_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .delete('/api/v1/articles/1')
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err2, res2) => {
              expect(res2.status).to.equal(401);
              expect(res2.body).to.haveOwnProperty('error');
              expect(res2.body.error).to.equal('You are not authorized to delete this article.');
              done();
            });
        });
    });

    it('Should let employee delete their article', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(EMPLOYEE1_CREDS)
        .end((err, res) => {
          const {token} = res.body.data;
          chai.request(app)
            .delete('/api/v1/articles/1')
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
