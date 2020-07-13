const mongoose = require('mongoose');

module.exports = (dbString) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Attempting to connect to database...');
    mongoose
      .connect(dbString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Estabilished MongoDB connection successfully!');
      });
  }

  mongoose.connection.on('disconnected', () => {
    console.log('Warning: Database connection lost');
  });
};
