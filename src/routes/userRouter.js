const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const authLimiter = require('../utils/authRateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, authController.signUp);
router.post('/login', authLimiter, authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateOwnPassword',
  isAuthenticated,
  authController.updatePassword
);
router.patch('/updateOwnData', isAuthenticated, userController.updateData);

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
