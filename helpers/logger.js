/**
 * Created by arey on 8/24/17.
 */
const winston = require('winston');
const config = require('config');

const logMethods = [
  'info', 'warn', 'error',
  'verbose', 'debug', 'silly',
];

module.exports = (name) => {
  const logger = new winston.Logger({
    level: config.get('logger.level'),
    exitOnError: false,
    transports: [
      new winston.transports.Console({
        timestamp: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
      }),
    ],
  });

  logMethods.forEach((method) => {
    const oldMethod = logger[method];

    logger[method] = function (msg, tags = {}) {
      if (this.name) {
        tags.name = this.name;
      }
      tags.level = method.toUpperCase();
      oldMethod(`${msg} [from: ${name}]`, tags);
    };
  });

  return logger;
};