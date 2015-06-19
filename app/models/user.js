import { Model } from 'mongorito';
import R from 'ramda';
import Restify from 'restify';
import Bcrypt from '../utils/bcrypt';

export default class User extends Model {
  configure() {
    this.privateFields = ['password', 'enc_password', 'created_at', 'updated_at'];
    this.before('save', 'validateFields');
    this.before('save', 'encryptPassword');
  }

  * validateFields(next) {
    let email = this.get('email');
    let password = this.get('password');
    if (!email) {
      throw new Restify.BadRequestError('No email provided');
    }
    if (!password) {
      throw new Restify.BadRequestError('No password provided');
    }
    let user = yield User.where('email', email).find();
    if (user.length > 0) {
      throw new Restify.UnprocessableEntityError('User already exists');
    }
    yield next;
  }

  * encryptPassword(next) {
    let salt = yield Bcrypt.genSalt(15);
    this.set('enc_password', yield Bcrypt.hash(this.get('password'), salt));
    yield next;
  }

  filter() {
    return R.omit(this.privateFields, this.attributes);
  }

  toJSON() {
    return this.filter();
  }
}
