import log4js from 'log4js';
import { getConfig } from './config';

const config = {
  appenders: {
    console: {
      type: 'console',
    },
    file: {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: getConfig('app.logger.level')
    },
  },
};

log4js.configure(config);

export default log4js.getLogger;
