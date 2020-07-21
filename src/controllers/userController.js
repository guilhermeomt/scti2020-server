const User = require('../models/user');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
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

const queryOptions = {
  defaultSort: 'firstName lastName',
  notAllowedFields: ['password', 'isAdmin'],
};
exports.getAllUsers = factory.getAll(User, queryOptions);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
