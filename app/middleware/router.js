'use strict';

import Index from '../controllers/index'
import Users from '../controllers/users-controller';
import Sessions from '../controllers/sessions-controller';

let Router = [
  {
    method: 'get',
    path: '/',
    handler: Index.home,
    protected: false
  },
  {
    method: 'post',
    path: '/users/create',
    handler: Users.create,
    protected: false
  },
  {
    method: 'get',
    path: '/user',
    handler: Users.get
  },
  {
    method: 'post',
    path: '/sessions/login',
    handler: Sessions.login,
    protected: false
  }
];

export default Router;
