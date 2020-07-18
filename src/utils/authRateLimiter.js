const rateLimit = require('express-rate-limit');
const ErrorResponse = require('./errorResponse');

const authLimiter = rateLimit({
  max: 10,
  windowMs: 20 * 60 * 1000,
  skipSuccessfulRequests: true,
  handler: (req, res, next) => {
    const error = new ErrorResponse(
      'Muitas tentativas inválidas. Tente novamente mais tarde',
      429
    );
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  },
});

module.exports = authLimiter;
