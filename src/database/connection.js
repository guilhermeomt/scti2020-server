const mongoose = require('mongoose');

module.exports = async (dbString, env) => {
  if (env === 'development') {
    try {
      await mongoose.connect(dbString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err); // TODO: better error handling
    }
  }
};
