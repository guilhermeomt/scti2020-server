const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

const sendErrorResponse = (res, err) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorResponseDev = (res, err) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleValidationError = (err) => {
  const errorMessage = Object.values(err.errors)
    .map((el) => el.properties.message)
    .join('\n');
  const error = new ErrorResponse(errorMessage, 400);
  return error;
};

const handleCastError = (err) => {
  const errorMessage = `${err.path} (${err.value}) não foi encontrado.`;
  const error = new ErrorResponse(errorMessage, 400);
  return error;
};

const handleJWTError = () => {
  const error = new ErrorResponse(
    'O seu token não é válido. Faça o login novamente.',
    401
  );
  return error;
};

const handleTokenExpiredError = () => {
  const error = new ErrorResponse(
    'O seu token expirou. Por favor, faça o login novamente.',
    401
  );
  return error;
};

module.exports = (err, req, res, next) => {
  if (!err.isOperational) {
    switch (err.name) {
      case 'ValidationError':
        return sendErrorResponse(res, handleValidationError(err));

      case 'CastError':
        return sendErrorResponse(res, handleCastError(err));

      case 'SyntaxError':
        return sendErrorResponse(res, err);

      case 'JsonWebTokenError':
        return sendErrorResponse(res, handleJWTError());

      case 'TokenExpiredError':
        return sendErrorResponse(res, handleTokenExpiredError());

      default:
    }

    logger.error(`Unhandled Error at Response: ${err}`, { label: 'http' });
    const error = new ErrorResponse();
    return sendErrorResponse(res, error);
  }

  if (process.env.NODE_ENV === 'production') {
    return sendErrorResponse(res, err);
  }

  if (process.env.NODE_ENV === 'development') {
    return sendErrorResponseDev(res, err);
  }

  return sendErrorResponse(res, err);
};
