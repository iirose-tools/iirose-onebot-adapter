import log4js from 'log4js';

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
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    },
  },
};

log4js.configure(config);

export default log4js.getLogger;
