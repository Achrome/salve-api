'use strict';

import { Model } from 'mongorito';

export default class User extends Model {
  configure() {
    this.before('save', 'validateFields');
    this.before('save', 'encryptPassword');
  }

  * validateFields(next) {
    let email = this.get('email');
    let password = this.get('password');
    if (!email) {
      throw new Error('No email provided');
    }
    if (!password) {
      throw new Error('No password provided');
    }
    let user = yield User.where('email', email).find();
    if (user.length > 0) {
      throw new Error('User already exists');
    }
    yield next;
  }

  * encryptPassword(next) {
    yield next;
  }
}
