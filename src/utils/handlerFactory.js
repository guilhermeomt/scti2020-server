const catchAsync = require('./catchAsync');
const ErrorResponse = require('./errorResponse');
const APIQueryFeatures = require('./apiQueryFeatures');

exports.getAll = (Model, queryOptions = {}) =>
  catchAsync(async (req, res, next) => {
    const features = new APIQueryFeatures(Model.find(), req.query)
      .filter()
      .sort(queryOptions.defaultSort)
      .fields(queryOptions.notAllowedFields)
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findById(id);

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
