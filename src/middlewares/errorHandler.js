const ErrorResponse = require('../utils/errorResponse');

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
};
