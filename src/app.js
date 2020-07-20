const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const userRouter = require('./routes/userRouter');
const logger = require('./utils/logger');
const notFoundRoute = require('./routes/notFoundRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
// HTTP Security Headers
app.use(helmet());

app.use(express.json());

// Prevents malicious requests with NoSQL injections
app.use(mongoSanitize());

// Prevents against Cross Site Scripting (XSS) attacks
app.use(xss());

// Prevents HTTP param pollution
app.use(hpp({ whitelist: ['phone'] }));

// Logs incoming requests
app.use(
  morgan(logger.reqStyle, {
    stream: logger.httpStream,
  })
);

// Routes
app.use('/api/v1/users', userRouter);

app.all('*', notFoundRoute);

// API Error Handler Middleware
app.use(errorHandler);

module.exports = app;
