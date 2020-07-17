const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router
  .route('/')
  .all(isAuthenticated, isAuthorized)
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .all(isAuthenticated, isAuthorized)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
