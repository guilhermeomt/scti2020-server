const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const APIQueryFeatures = require('../utils/apiQueryFeatures');

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

  const deletedUser = await User.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    data: deletedUser,
  });
});
