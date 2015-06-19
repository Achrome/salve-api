import bunyan from 'bunyan';
import path from 'path';

export default class Logger {
  constructor() {
    this.logger = bunyan.createLogger({
      name: 'Salve API',
      streams: [
        {
          level: 'debug',
          stream: process.stdout
        },
        {
          level: 'warn',
          stream: path.resolve('..', '..', 'log', 'error.log')
        }
      ]
    });
  }
  getLogger() {
    return this.logger;
  }
}
