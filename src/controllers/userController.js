const User = require('../models/user');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// Retrieves Speaker model from User
const { Speaker } = User.discriminators;

const filterBodyFields = (body, ...notAllowedFields) => {
  const filteredBody = {};

  Object.keys(body).forEach((el) => {
    if (!notAllowedFields.includes(el)) {
      filteredBody[el] = body[el];
    }
  });
  return filteredBody;
};

exports.getData = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.getUserRole = (req, res, next) => {
  const Model = req.user.role === 'Speaker' ? Speaker : User;

  req.Model = Model;
  next();
};

exports.updateData = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new ErrorResponse('Não se pode mudar a senha nesta rota!', 400)
    );
  }

  const filteredBody = filterBodyFields(
    req.body,
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetExpiresIn',
    'isAdmin'
  );

  let { Model } = req;
  if (!req.Model) {
    Model = User;
  }

  const updatedUser = await Model.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

const queryOptions = {
  defaultSort: 'firstName lastName',
  notAllowedFields: ['password', 'isAdmin'],
};
exports.getAllUsers = factory.getAll(User, queryOptions);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);

// Couldn't assign it to factory.updateOne(User) because it wouldn't update Speaker fields
exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select('role');

  if (!user) {
    return next(
      new ErrorResponse('O documento requisitado não foi encontrado.', 404)
    );
  }

  const Model = user === 'Speaker' ? Speaker : User;

  /* Need to use the right Model (User or Speaker) to update the document 
    (that's why I queried again and didn't updated from the document directly) */
  const updatedUser = await Model.findByIdAndUpdate(user._id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deleteUser = factory.deleteOne(User);
