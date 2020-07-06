const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({
  path: resolve(__dirname, '..', 'config.dev.env'),
});

const app = require('./app');

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}...`);
});
