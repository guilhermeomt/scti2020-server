const express = require('express');
const userRouter = require('./routes/userRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);

// API Error Handler Middleware
app.use(errorHandler);

module.exports = app;
