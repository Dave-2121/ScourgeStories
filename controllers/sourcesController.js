const Source = require(`${__dirname}/../models/sourcesModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require('../utils/appError');

const createSource = catchAsync(async function (req, resp, next) {
  const source = await Source.create(req.body);

  resp.status(201).json({
    status: 'success',
    data: {
      source,
    },
  });
});

const deleteSource = catchAsync(async function (req, resp, next) {
  const id = req.params.id;
  const source = await Source.findByIdAndDelete(id);

  if (!source) {
    return next(new AppError(`cannot find source with id:${id}`, 404));
  }

  resp.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateSource = catchAsync(async function (req, resp, next) {
  const id = req.params.id;
  const source = await Source.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!source) {
    return next(new AppError(`cannot find source with id:${id}`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: {
      source,
    },
  });
});

module.exports = { createSource, deleteSource, updateSource };
