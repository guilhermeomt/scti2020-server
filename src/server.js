const dotenv = require('dotenv');
const { resolve } = require('path');
const createDbConnection = require('./database/connection');

dotenv.config({
  path: resolve(__dirname, '..', 'config.dev.env'),
});
const { PORT, MONGO_URI } = process.env;

createDbConnection(MONGO_URI);

const app = require('./app');

const port = PORT || 3001;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.stack}`);
  server.close(() => {
    console.log('Closing server...');
    process.exit(1);
  });
});
