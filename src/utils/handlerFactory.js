const catchAsync = require('./catchAsync');
const ErrorResponse = require('./errorResponse');
const APIQueryFeatures = require('./apiQueryFeatures');

exports.getAll = (Model, queryOptions = {}, popOptions = null) =>
  catchAsync(async (req, res, next) => {
    const features = new APIQueryFeatures(Model.find(), req.query)
      .filter()
      .sort(queryOptions.defaultSort)
      .fields(queryOptions.notAllowedFields)
      .paginate();

    if (popOptions) {
      features.query = features.query.populate(popOptions);
    }

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

exports.getOne = (Model, popOptions = null) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(
        new ErrorResponse('O documento requisitado não foi encontrado.', 404)
      );
    }

    return res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new ErrorResponse('O documento requisitado não foi encontrado.', 404)
      );
    }

    return res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(
        new ErrorResponse('O documento requisitado não foi encontrado.', 404)
      );
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });
