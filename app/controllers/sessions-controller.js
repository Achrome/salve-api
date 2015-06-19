import User from '../models/user';
import Bcrypt from '../utils/bcrypt';
import Restify from 'restify';
import JWT from '../middleware/jwt';
import co from 'co';

let SessionsController = {};

SessionsController.login = (req, res, next) => {
  co(function* () {
    let email = req.params.email;
    if (!email) {
      throw new Restify.ForbiddenError('Email or password missing');
    }
    let user = yield User.findOne({ email: email });
    let password = req.params.password;
    if (!password) {
      throw new Restify.ForbiddenError('Email or password missing');
    }
    if (!user) {
      throw new Restify.NotFoundError();
    } else {
      let validPass = yield Bcrypt.compare(password, user.get('enc_password'));
      if (!validPass) {
        throw new Restify.InvalidCredentialsError();
      }
      let token = JWT.sign(user);
      if (!token) {
        throw new Restify.InternalError();
      }
      res.send(200, { token: token });
    }
  }).then(() => next, (err) => next(err));
};

export default SessionsController;
