import User from '../models/user';
import co from 'co';
import Restify from 'restify';
import R from 'ramda';

let UsersController = {};

UsersController.create = (req, res, next) => {
  let user = new User({
    email: req.params.email,
    password: req.params.password
  });

  co(function* () {
    yield user.save();
    res.send(201, {
      id: user.get('_id')
    });
  }).then(next).catch(next);
};

UsersController.get = (req, res, next) => {
  const id = req.user;
  co(function* () {
    const user = yield User.findOne({ '_id': id });
    if (!user) {
      throw new Restify.NotFoundError();
    }

    res.send(200, {
      user: R.dissoc('_id', user.toJSON())
    });
  }).then(next).catch(next);
};

export default UsersController;
