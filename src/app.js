const express = require('express');
const userRouter = require('./routes/userRouter');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);

module.exports = app;
