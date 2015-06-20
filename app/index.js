import Restify from 'restify';
import Mongorito from 'mongorito';
import Logger from './utils/logger';
import Middleware from './middleware';

export default (() => {
  const port = process.env.PORT || 3131;
  const host = process.env.HOST || '127.0.0.1';
  const LOG = global.LOG = (new Logger()).getLogger();
  const server = Restify.createServer({
    name: 'Salve API',
    version: '0.1.0',
    log: LOG
  });
  Middleware.inject(server);
  Mongorito.connect('localhost/salve-db');
  server.listen(port, host, (err) => {
    if (err) {
      LOG.error(err);
      Mongorito.disconnect();
      Mongorito.close();
    } else {
      LOG.info(`${server.name} is running at port ${server.url}`);
    }
  });
})();
