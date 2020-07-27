const { Router } = require('express');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const inviteController = require('../controllers/inviteController');

const router = Router();

router.post('/', isAuthenticated, isAuthorized, inviteController.createInvite);

router.post('/signup/:token', authController.signUpByInvite);

module.exports = router;
