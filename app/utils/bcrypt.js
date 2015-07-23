/* @flow */

import Bcrypt from 'bcrypt';

let CoBcrypt : Object = {};

CoBcrypt.genSalt = (rounds : number, seedLength : number) =>
  (done : Function) => {
    Bcrypt.genSalt(rounds, seedLength, done);
  };

CoBcrypt.hash = (str : string, salt : string) =>
  (done : Function) => {
    Bcrypt.hash(str, salt, done);
  };

CoBcrypt.compare = (str : String, hash : String) =>
  (done : Function) => {
    Bcrypt.compare(str, hash, done);
  };

export default CoBcrypt;
