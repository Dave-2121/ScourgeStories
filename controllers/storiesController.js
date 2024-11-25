const AppError = require('../utils/appError');

const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const STORIES = require(`${__dirname}/../models/storiesModel`);
const Tags = require(`${__dirname}/../models/tagsModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

const getAllStories = catchAsync(async function getAllStories(req, resp, next) {
  const features = new APIFeatures(STORIES.find(), req.query)
    .filter()
    .paginate();

  const stories = await features.query;
  resp.status(200).json({
    status: 'success',
    results: stories.length,
    data: {
      stories,
    },
  });
});

const getStory = catchAsync(async function (req, resp, next) {
  const id = req.params.id;
  const story = await STORIES.findById(id);

  if (!story) {
    return next(new AppError(`cannot find story with id ${id}`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: {
      story,
    },
  });
});

const createStory = catchAsync(async function (req, resp, next) {
  const tags = req.body.tags;

  const existingTags = await Tags.find({ name: { $in: tags } });
  const existingTagsNames = existingTags.map((ele) => ele.name);

  const tagsToCreate = tags.filter((ele) => !existingTagsNames.includes(ele));

  let createdTags = [];

  if (tagsToCreate.length > 0) {
    const tagsArray = tagsToCreate.map((ele) => {
      return { name: ele };
    });
    createdTags = await Tags.insertMany(tagsArray);
  }

  const AllTagIds = [
    ...createdTags.map((ele) => ele._id),
    ...existingTags.map((ele) => ele._id),
  ];

  const story = await STORIES.create({ ...req.body, tags: AllTagIds });

  // if (!story) {
  //   return next(new AppError(`cannot find story with id ${id}`, 404));
  // }

  resp.status(201).json({
    status: 'success',
    data: {
      story,
    },
  });
});
const deleteStory = catchAsync(async function (req, resp, next) {
  const story = await STORIES.findByIdAndDelete(req.params.id);

  if (!story) {
    return next(new AppError(`cannot find story with id ${id}`, 404));
  }

  resp.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateStory = catchAsync(async (req, resp, next) => {
  const id = req.params.id;
  const deleteTags = req.body.deleteTags;
  const createTags = req.body.createTags;

  const currentStory = await STORIES.findById(id);
  const storyTags = currentStory?.tags?.map((ele) => ele._id);
  const storyTagsString = storyTags.map((ele) => ele.toString());

  const existingTags = await Tags.find({ name: { $in: createTags } });
  const existingTagsNames = existingTags.map((ele) => ele.name);
  const existingTagIds = existingTags.map((ele) => ele._id.toString());

  const newTagNames =
    createTags && createTags.filter((ele) => !existingTagsNames.includes(ele));

  let newTags = [];
  if (newTagNames?.length > 0) {
    if (newTagNames.some((tag) => typeof tag !== 'string')) {
      return next(
        new AppError(
          'Invalid tag format for creation. Tags should be strings.',
          400,
        ),
      );
    }

    const createTagsName = newTagNames.map((name) => ({ name }));
    const createdTags = await Tags.insertMany(createTagsName);
    newTags = createdTags.map((ele) => ele._id.toString());
  }

  let filter = storyTagsString;
  if (deleteTags?.length > 0) {
    filter = storyTagsString.filter((id) => !deleteTags.includes(id));
  }

  newTags = [...existingTagIds, ...newTags];

  const updatedTags = [...new Set([...filter, ...newTags])];
  req.body.tags = updatedTags;

  const story = await STORIES.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!story) {
    return next(new AppError(`cannot find story with id ${id}`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: {
      story,
    },
  });
});

module.exports = {
  getAllStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
};
