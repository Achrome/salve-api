import Jwt from 'jsonwebtoken';
import Router from './router';
import R from 'ramda';
import co from 'co';
import { InvalidHeaderError, InvalidCredentialsError, ForbiddenError } from 'restify';

const SECRET_KEY : string = 'omfg wow';

let opts : Object = {
  algorithm: 'HS512',
  expiresInMinutes: 60 * 5
};

let JWT : Object = {};

JWT.sign = user => Jwt.sign(user.toJSON(), SECRET_KEY, opts);

JWT.verify = token =>
  (done) => {
    Jwt.verify(token, SECRET_KEY, opts, done);
  };

JWT.decode = token => Jwt.decode(token).payload;

JWT.middleware = (req : Object, res : Object, next : Function) => {
  co(function* () {
    let skippedRoutes = R.map(route => route.path, R.filter(route => route.protected === false, Router));
    if (R.contains(req.url, skippedRoutes)) {
      return next();
    }
    if (!req.headers) {
      throw new InvalidHeaderError('Invalid headers');
    }
    if (!req.headers['x-salve-auth']) {
      throw new InvalidCredentialsError('Invalid or no token');
    }
    let parts = req.headers['x-salve-auth'].split(' ');
    let token;
    if (parts.length === 2) {
      if (/^Bearer$/.test(parts[0])) {
        token = parts[1];
      } else {
        throw new InvalidCredentialsError('Invalid or no token');
      }
    } else {
      throw new InvalidCredentialsError('Invalid or no token');
    }
    return yield JWT.verify(token);
  }).then((decoded : string, err : Error) => {
    if (err) {
      return next(new ForbiddenError(err));
    }
    /* eslint-disable no-underscore-dangle */
    req.user = decoded._id;
    return next();
    /* eslint-enable no-underscore-dangle */
  }, (err) => next(new ForbiddenError(err)));
};

export default JWT;
