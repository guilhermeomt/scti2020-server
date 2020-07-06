const express = require('express');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

module.exports = app;
