import chai from 'chai';
import Mongorito from 'mongorito';
import User from '../../app/models/user';
import Restify from 'restify';
import Sinon from 'sinon';

const expect = chai.expect;

describe('User', () => {

  before(function* () {
    Mongorito.connect('mongodb://localhost/salve-db-test');
  });

  after(function* () {
    yield User.drop();
    Mongorito.disconnect();
  });

  describe('has validation for', () => {
    it('email', function* () {
      let user = new User({
        password: 'bar'
      });
      try {
        yield user.save();
      } catch(err) {
        expect(err).to.be.an.instanceOf(Restify.BadRequestError);
        expect(err.message).to.equal('No email provided');
      }
    });
    it('password', function* () {
      let user = new User({
        email: 'foo'
      });
      try {
        yield user.save();
      } catch(err) {
        expect(err).to.be.an.instanceOf(Restify.BadRequestError);
        expect(err.message).to.equal('No password provided');
      }
    });
    it('duplicate email', function* () {
      let user1 = new User({
        email: 'foo',
        password: 'bar'
      });
      let user2 = user1;
      yield user1.save();
      try {
        yield user2.save();
      } catch(err) {
        expect(err).to.be.an.instanceOf(Restify.UnprocessableEntityError);
        expect(err.message).to.equal('User already exists');
      }
      yield user1.remove();
      yield user2.save();
      /* eslint-disable no-unused-expressions */
      expect(user2.get('_id')).to.be.ok;
      /* eslint-enable no-unused-expressions */
    });
  });

  describe('is saved successfully', () => {
    it('and returns an ID', function* () {
      let user = new User({
        email: 'foo',
        password: 'bar'
      });
      Sinon.stub(user, 'save', function* () {
        user.set('_id', 1);
      });
      yield user.save();
      expect(user.get('_id')).to.equal(1);
      /* eslint-disable no-unused-expressions*/
      expect(user.get('password')).to.be.ok;
      /* eslint-enable no-unused-expressions */
      expect(user.toJSON()).to.not.include.keys('password');
      expect(user.toJSON()).to.not.include.keys('enc_password');
    });
  });
});
