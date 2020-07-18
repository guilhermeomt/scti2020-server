const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const APIQueryFeatures = require('../utils/apiQueryFeatures');
const ErrorResponse = require('../utils/errorResponse');

const filterBodyFields = (body, ...allowedFields) => {
  const filteredBody = {};

  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = body[el];
    }
  });
  return filteredBody;
};

exports.updateData = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new ErrorResponse('Não se pode mudar a senha nesta rota!', 400)
    );
  }

  const filteredBody = filterBodyFields(
    req.body,
    'firstName',
    'lastName',
    'email',
    'phone'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIQueryFeatures(User.find(), req.query)
    .filter()
    .sort('firstName lastName')
    .fields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newUser,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
