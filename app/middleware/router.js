'use strict';

import Index from '../controllers/index'
import Users from '../controllers/users-controller';

let Router = [
  {
    method: 'get',
    path: '/',
    handler: Index.home
  },
  {
    method: 'post',
    path: '/users/create',
    handler: Users.create
  }
];

export default Router;
