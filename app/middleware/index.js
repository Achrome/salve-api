'use strict';

import Restify from 'restify';
import Router from './router';

let middleware = {
  inject: (server) => {
    server.use((req, res, next) => {
      res.header('X-Powered-By', 'Salve');
      res.charSet('utf-8');
      return next();
    })
    server.use(Restify.requestLogger());
    server.use(Restify.gzipResponse());
    server.use(Restify.acceptParser(server.acceptable));
    server.use(Restify.queryParser());
    server.use(Restify.jsonp());
    server.use(Restify.bodyParser());
    server.use(Restify.dateParser());
    server.use(Restify.authorizationParser());
    server.use(Restify.CORS({
      credentials: true
    }));
    for (let route of Router) {
      if (!server[route.method]) {
        throw new Error(`Incorrect method handler ${route.method} given for ${route.path}. Ignoring this route`);
      }
      server[route.method](route.path, route.handler);
    }
    server.on('after', Restify.auditLogger({
      log: global.LOG
    }));
  }
};

export default middleware;
