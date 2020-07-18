const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

const verifyToken = async (token) => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(
      new ErrorResponse(
        'Você não está logado. Por favor, faça o login para entrar.',
        401
      )
    );
  }

  const decodedToken = await verifyToken(token);

  const currentUser = await User.findById(decodedToken.id).select('+isAdmin');
  if (!currentUser) {
    return next(
      new ErrorResponse(
        'O usuário que possuia este token não existe mais.',
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new ErrorResponse(
        'Você trocou sua senha recentemente. Por favor, faça o login novamente.',
        401
      )
    );
  }

  req.user = currentUser;
  return next();
});

exports.isAuthorized = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(
      new ErrorResponse(
        'Você não possui permissão para realizar esta ação.',
        403
      )
    );
  }

  return next();
};
