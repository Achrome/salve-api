'use strict';

import User from '../models/user';
import Co from 'co';

let UsersController = {};

UsersController.create = (req, res, next) => {
  let user =  new User({
    email: req.params.email,
    password: req.params.password
  });

  Co(function* () {
    yield user.save();
  }).then(() => {
    res.send(201)
  }, (err) => {
    res.send(422, err);
  });

  return next();
};

export default UsersController;
