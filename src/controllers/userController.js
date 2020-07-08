const User = require('../models/user');

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
