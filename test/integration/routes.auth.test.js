const chai = require('chai');
// const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');

describe('routes : auth', () => {

  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  describe('GET /auth', () => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log('process.env.DB_NAME', process.env.DB_NAME);
    it('should render the auth', (done) => {
      chai.request(server)
        .get('/auth')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          done();
        });
    });
  });
});
