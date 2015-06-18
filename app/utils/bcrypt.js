'use strict';

import Bcrypt from 'bcrypt';

let CoBcrypt = {};

CoBcrypt.genSalt = (rounds, seedLength) => {
  return (done) => {
    Bcrypt.genSalt(rounds, seedLength, done);
  };
};

CoBcrypt.hash = (str, salt) => {
  return (done) => {
    Bcrypt.hash(str, salt, done);
  };
};

CoBcrypt.compare = (str, hash) => {
  return (done) => {
    Bcrypt.compare(str, hash, done);
  };
};

export default CoBcrypt;
