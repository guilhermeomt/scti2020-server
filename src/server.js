const dotenv = require('dotenv');
const { resolve } = require('path');
const createDbConnection = require('./database/connection');
const logger = require('./utils/logger');

dotenv.config({
  path: resolve(__dirname, '..', 'config.private_dev.env'),
});
const { PORT, MONGO_URI } = process.env;

createDbConnection(MONGO_URI);

const app = require('./app');

const port = PORT || 3001;
const server = app.listen(port, () => {
  logger.info(`Server is now running on port ${port}`, { label: 'server' });
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection Error: ${err.stack}`);
  server.close(() => {
    logger.error('Closing server...', { label: 'server' });
    process.exit(1);
  });
});
