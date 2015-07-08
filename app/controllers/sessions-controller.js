import User from '../models/user';
import Bcrypt from '../utils/bcrypt';
import { ForbiddenError, InvalidCredentialsError, NotFoundError, InternalError } from 'restify';
import JWT from '../middleware/jwt';
import co from 'co';

let SessionsController = {};

SessionsController.login = (req, res, next) => {
  co(function* () {
    const email = req.params.email;
    if (!email) {
      throw new ForbiddenError('Email or password missing');
    }
    const user = yield User.findOne({ email: email });
    const password = req.params.password;
    if (!password) {
      throw new ForbiddenError('Email or password missing');
    }
    if (!user) {
      throw new NotFoundError();
    } else {
      const validPass = yield Bcrypt.compare(password, user.get('password'));
      if (!validPass) {
        throw new InvalidCredentialsError();
      }
      const token = JWT.sign(user);
      if (!token) {
        throw new InternalError();
      }
      res.send(200, { token: token });
    }
  }).then(next).catch(next);
};

export default SessionsController;
