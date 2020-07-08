const User = require('../models/user');

// ! Refactor this entire controller, but for now it works

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    // TODO: Request body validation
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user: newUser,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      user: updatedUser,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      user: deletedUser,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};
