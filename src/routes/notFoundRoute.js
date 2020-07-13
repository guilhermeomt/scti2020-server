const ErrorResponse = require('../utils/errorResponse');

module.exports = (req, res, next) => {
  next(new ErrorResponse(`Opa... ${req.originalUrl} não existe!`, 404));
};
