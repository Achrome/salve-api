import Jwt from 'jsonwebtoken';
import Router from './router';
import R from 'ramda';
import co from 'co';
import Restify from 'restify';

const SECRET_KEY = 'omfg wow';

let opts = {
  algorithm: 'HS512',
  expiresInMinutes: 60 * 5
};

let JWT = {};

JWT.sign = user => Jwt.sign(user.toJSON(), SECRET_KEY, opts);

JWT.verify = (token) => {
  return (done) => {
    Jwt.verify(token, SECRET_KEY, opts, done);
  };
};

JWT.decode = token => Jwt.decode(token).payload;

JWT.middleware = (req, res, next) => {
  co(function* () {
    let skippedRoutes = R.map(route => route.path, R.filter(route => route.protected === false, Router));
    if (R.contains(req.url, skippedRoutes)) {
      return next();
    }
    if (!req.headers) {
      throw new Restify.InvalidHeaderError('Invalid headers');
    }
    if (!req.headers['x-salve-auth']) {
      throw new Restify.InvalidCredentialsError('Invalid or no token');
    }
    let parts = req.headers['x-salve-auth'].split(' ');
    let token;
    if (parts.length === 2) {
      if (/^Bearer$/.test(parts[0])) {
        token = parts[1];
      } else {
        throw new Restify.InvalidCredentialsError('Invalid or no token');
      }
    } else {
      throw new Restify.InvalidCredentialsError('Invalid or no token');
    }
    return yield JWT.verify(token);
  }).then((decoded, err) => {
    if (err) {
      return next(new Restify.ForbiddenError(err));
    }
    /* eslint-disable no-underscore-dangle */
    req.user = decoded._id;
    return next();
    /* eslint-enable no-underscore-dangle */
  }, (err) => next(new Restify.ForbiddenError(err)));
};

export default JWT;
