'use strict';

import User from '../models/user';
import co from 'co';
import Restify from 'restify';

let UsersController = {};

UsersController.create = (req, res, next) => {
  let user = new User({
    email: req.params.email,
    password: req.params.password
  });

  co(function* () {
    return yield user.save();
  }).then((usr) => {
    res.send(201, {
      id: usr.get('_id')
    });
    next();
  }, err => next(err));
};

UsersController.get = (req, res, next) => {
  const id = req.user;
  co(function* () {
    return yield User.findOne({ id: id });
  }).then((user) => {
    if (!user) {
      return next(new Restify.NotFoundError());
    }
    res.send(200, {
      user: user
    });
  }, err => next(err));
};

export default UsersController;
