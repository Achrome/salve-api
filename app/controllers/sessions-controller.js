'use strict';

import co from 'co';
import User from '../models/user';
import Bcrypt from '../utils/bcrypt';

let SessionsController = {};

SessionsController.login = (req, res, next) => {
  co(function* () {
    let email = req.params.email;
    return yield User.findOne('email', email);
  }).then((user) => {
    let password = req.params.password;
    if (!user) {
      res.send(401);
    } else {
      co(function* () {
        return yield Bcrypt.compare(password, user.get('encryptedPassword'));
      }).then(() => res.send(200), () => res.send(401));
    }
  }, () => res.send(500)).then(next);
};

export default SessionsController;
