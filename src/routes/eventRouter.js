const { Router } = require('express');
const eventController = require('../controllers/eventController');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');

const router = Router();

router.use(isAuthenticated, isAuthorized);

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router.get('/:id', eventController.getEvent);

router
  .route('/:id')
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;
