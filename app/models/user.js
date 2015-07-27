import { Model } from 'mongorito';
import R from 'ramda';
import { BadRequestError, UnprocessableEntityError } from 'restify';
import Bcrypt from '../utils/bcrypt';

export default class User extends Model {
  configure() {
    this.privateFields = ['password', 'created_at', 'updated_at'];
    this.before('save', 'validateFields');
    this.before('save', 'encryptPassword');
  }

  * validateFields(next) {
    const email = this.get('email');
    const password = this.get('password');
    if (!email) {
      throw new BadRequestError('No email provided');
    }
    if (!password) {
      throw new BadRequestError('No password provided');
    }
    const user = yield User.where('email', email).find();
    if (user.length > 0) {
      throw new UnprocessableEntityError('User already exists');
    }
    yield next;
  }

  * encryptPassword(next) {
    const salt = yield Bcrypt.genSalt(15);
    this.password = yield Bcrypt.hash(this.password, salt);
    yield next;
  }

  filter() {
    return R.omit(this.privateFields, this.attributes);
  }

  toJSON() {
    return this.filter();
  }
}
