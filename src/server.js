const dotenv = require('dotenv');
const { resolve } = require('path');
const createDbConnection = require('./database/connection');

dotenv.config({
  path: resolve(__dirname, '..', 'config.dev.env'),
});
const { PORT, NODE_ENV, MONGO_URI } = process.env;

createDbConnection(MONGO_URI, NODE_ENV);

const app = require('./app');

const port = PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}...`);
});
