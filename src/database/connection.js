const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = async (dbString) => {
  // Listeners for db connection logging
  mongoose.connection.on('connecting', () => {
    logger.info(`Attempting to connect to database...`, { label: 'db' });
  });

  mongoose.connection.on('connected', () => {
    logger.info(`Estabilished database connection successfully!`, {
      label: 'db',
    });
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('Connection to database lost', { label: 'db' });
  });

  // Connection process
  if (process.env.NODE_ENV === 'development') {
    await mongoose.connect(dbString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  }
};
