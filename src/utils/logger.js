const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level}[${info.label || ''}]: ${
              info.message
            }`
        )
      ),
    }),
  ],
});

logger.reqStyle = process.env.NODE_ENV === 'production' ? 'short' : 'dev';

logger.httpStream = {
  write: (message) => {
    logger.info(message.replace(/\n$/, ''), { label: 'http' });
  },
};

module.exports = logger;
