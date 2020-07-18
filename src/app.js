const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const userRouter = require('./routes/userRouter');
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

// Routes
app.use('/api/v1/users', userRouter);

app.all('*', notFoundRoute);

// API Error Handler Middleware
app.use(errorHandler);

module.exports = app;
