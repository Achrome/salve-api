import Restify from 'restify';
import Mongorito from 'mongorito';
import Middleware from './middleware';
import Bunyan from 'bunyan';
import Path from 'path';

export default (() => {
  const port : number = process.env.PORT || 3131;
  const host : string = process.env.HOST || '127.0.0.1';
  global.LOG = Bunyan.createLogger({
    name: 'Salve API',
    streams: [
      {
        level: 'debug',
        stream: process.stdout
      },
      {
        level: 'warn',
        stream: Path.resolve('..', '..', 'log', 'error.log')
      }
    ]
  });
  const server : Object = Restify.createServer({
    name: 'Salve API',
    version: '0.1.0',
    log: global.LOG
  });
  Middleware.inject(server);
  Mongorito.connect('localhost/salve-db');
  server.listen(port, host, (err : Error) => {
    if (err) {
      global.LOG.error(err);
      Mongorito.disconnect();
      Mongorito.close();
    } else {
      global.LOG.info(`${server.name} is running at port ${server.url}`);
    }
  });
})();
