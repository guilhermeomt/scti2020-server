const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

app.use(express.json());
dotenv.config({
  path: path.resolve(__dirname, '..', 'config.dev.env'),
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
