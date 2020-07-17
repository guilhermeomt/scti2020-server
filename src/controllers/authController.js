const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

const signToken = async (id) => {
  return promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password,
  });

  res.status(200).json({
    status: 'success',
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse('Por favor, digite seu email e sua senha.', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new ErrorResponse('Email ou senha incorretos.', 401));
  }

  const token = await signToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});
