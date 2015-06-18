'use strict';

import Jwt from 'jsonwebtoken';
import Router from './router';
import R from 'ramda';
import co from 'co';
import Restify from 'restify';

const SECRET_KEY = 'omfg wow';

let opts = {
  algorithm: 'ES512',
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
    if (!req.headers.auth) {
      throw new Restify.InvalidCredentialsError('Invalid or no token');
    }
    let parts = req.headers.authorization.split(' ');
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
  }).then((err, decoded) => {
    if (err) {
      return next(err);
    }
    /* eslint-disable no-underscore-dangle */
    req.user = decoded._id;
    return next();
    /* eslint-enable no-underscore-dangle */
  }, err => next(err));
};

export default JWT;
