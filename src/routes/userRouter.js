const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const inviteRouter = require('./inviteRouter');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const authLimiter = require('../utils/authRateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, authController.signUp);
router.post('/login', authLimiter, authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use('/invite', inviteRouter);

router.use(isAuthenticated);

router.get('/getOwnData', userController.getData, userController.getUser);
router.patch('/updateOwnPassword', authController.updatePassword);
router.patch(
  '/updateOwnData',
  userController.getUserRole,
  userController.updateData
);

router.use(isAuthorized);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
