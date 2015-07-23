import Restify from 'restify';
import Router from './router';
import JWT from './jwt';

let middleware : Object = {
  inject: (server : Object) => {
    server.use((req : Object, res : Object, next : Function) => {
      res.header('X-Powered-By', 'Salve');
      res.charSet('utf-8');
      return next();
    });
    server.use(Restify.requestLogger());
    server.use(Restify.gzipResponse());
    server.use(Restify.acceptParser(server.acceptable));
    server.use(Restify.queryParser());
    server.use(Restify.jsonp());
    server.use(Restify.bodyParser());
    server.use(Restify.dateParser());
    /* eslint-disable babel/new-cap */
    server.use(Restify.CORS({
      credentials: true
    }));
    /* eslint-enable babel/new-cap */
    server.use(JWT.middleware);
    server.on('after', Restify.auditLogger({
      log: global.LOG
    }));
    for (let route of Router) {
      if (!server[route.method]) {
        throw new Error(`Incorrect method handler ${route.method} given for ${route.path}. Please use a valid HTTP verb`);
      }
      server[route.method](route.path, route.handler);
    }
  }
};

export default middleware;
