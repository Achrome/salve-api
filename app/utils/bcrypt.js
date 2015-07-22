/* @flow */

import Bcrypt from 'bcrypt';

let CoBcrypt : Object = {};

CoBcrypt.genSalt = (rounds : Number, seedLength : Number) => {
  return (done : Function) => {
    Bcrypt.genSalt(rounds, seedLength, done);
  };
};

CoBcrypt.hash = (str : String, salt : String) => {
  return (done : Function) => {
    Bcrypt.hash(str, salt, done);
  };
};

CoBcrypt.compare = (str : String, hash : String) => {
  return (done : Function) => {
    Bcrypt.compare(str, hash, done);
  };
};

export default CoBcrypt;
