const Event = require('../models/event');
const factory = require('../utils/handlerFactory');

const queryOptions = {
  defaultSort: 'startDate',
  /* notAllowedFields: [], */
};
const popOptions = {
  path: 'enrollments',
  select: 'firstName lastName',
};
exports.getAllEvents = factory.getAll(Event, queryOptions);
exports.getEvent = factory.getOne(Event, popOptions);
exports.createEvent = factory.createOne(Event);
exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
