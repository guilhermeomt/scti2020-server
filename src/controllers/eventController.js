const Event = require('../models/event');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

exports.enroll = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Event.findById(id).select(
    'name type startDate hoursDuration enrollments'
  );

  if (!event) {
    return next(new ErrorResponse('Evento não encontrado.', 404));
  }

  if (event.isFull()) {
    return next(new ErrorResponse('Este evento não possui mais vagas.', 400));
  }

  const eventOutput = await event.enroll(req.user._id).then((doc) => {
    doc.enrollments = undefined;
    doc.__v = undefined;
    doc.updatedAt = undefined;
    return doc;
  });

  return res.status(200).json({
    status: 'success',
    data: eventOutput,
  });
});

exports.disenroll = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Event.findById(id).select(
    'name type startDate hoursDuration enrollments'
  );

  if (!event) {
    return next(new ErrorResponse('Evento não encontrado.', 404));
  }

  let eventOutput = null;
  if (event.isEnrolled(req.user._id)) {
    eventOutput = await event.disenroll(req.user._id.toString()).then((doc) => {
      doc.enrollments = undefined;
      doc.__v = undefined;
      doc.updatedAt = undefined;
      return doc;
    });
  } else {
    return next(new ErrorResponse('Você não está inscrito nesse evento.', 400));
  }

  return res.status(200).json({
    status: 'success',
    data: eventOutput,
  });
});

const getEventDate = (year, day) => {
  const initialDate =
    year === 2020 ? new Date('2020-11-09') : new Date('2019-11-04');

  const initialDateTimestamp = initialDate.getTime();
  const dayTimestamp = 24 * 3600 * 1000;
  switch (day) {
    case 1:
      return initialDate;
    case 2:
      return new Date(initialDateTimestamp + dayTimestamp);
    case 3:
      return new Date(initialDateTimestamp + 2 * dayTimestamp);
    case 4:
      return new Date(initialDateTimestamp + 3 * dayTimestamp);
    case 5:
      return new Date(initialDateTimestamp + 4 * dayTimestamp);
    case 6:
      return new Date(initialDateTimestamp + 5 * dayTimestamp);

    default:
      return initialDate;
  }
};

exports.getEventsInfo = catchAsync(async (req, res, next) => {
  const { year, day } = req.query;

  let query = Event.find();

  if (year && day) {
    const date = getEventDate(+year, +day);

    query = Event.find({
      startDate: {
        $gt: date,
        $lt: new Date(date.getTime() + 24 * 3600 * 1000),
      },
    });
  }

  const events = await query
    .select('-enrollments -__v -createdAt -updatedAt')
    .sort('startDate name')
    .populate({
      path: 'speaker',
      select: '-_id -__v -role -phone -email -createdAt -updatedAt',
    });

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: events,
  });
});

const queryOptions = {
  defaultSort: 'startDate name',
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
