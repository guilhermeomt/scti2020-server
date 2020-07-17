const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/user');
const sendEmail = require('../utils/mailer');
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorResponse('Não existe um usuário com este endereço de email', 404)
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const text = `Você quer mudar sua senha? Faça uma requisição HTTP PATCH (por enquanto!) com sua nova senha para o seguinte endereço:\n\n${resetURL} (expira em 10 minutos)\n\nEste email é automático. Caso o link acima esteja quebrado, entre em contato com algum adminstrador do evento. E se você não tiver esquecido sua senha, simplesmente ignore este email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'SCTI 2020: Alteração de senha',
      text,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Email enviado com sucesso!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(
        'Não foi possível enviar o email. Tente novamente mais tarde!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (token.length !== 64) {
    return next(new ErrorResponse('Token inválido ou foi expirado', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Token inválido ou foi expirado!', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  await user.save();

  const jwtToken = await signToken(user._id);

  return res.status(200).json({
    status: 'success',
    token: jwtToken,
  });
});
