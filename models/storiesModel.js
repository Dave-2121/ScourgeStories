const mongoose = require('mongoose');

const storiesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A story must have a title!'],
    trim: true,
  },
  shortTitle: {
    type: String,
    required: [true, 'A story must have a short title!'],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'A story must have a short title!'],
    trim: true,
    minlength: [10, 'A story cannot have a summary less than 10 char!'],
  },
  sourceLink: {
    type: String,
    required: [true, 'A story must have a source link!'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'categories',
      required: [true, 'A story must have a category!'],
    },
  ],
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'tags',
      required: [true, 'A story must have a tag!'],
    },
  ],
  deleteTags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'tags',
      select: false,
    },
  ],
  createTags: [
    {
      type: String,
      select: false,
    },
  ],
  source: {
    type: mongoose.Schema.ObjectId,
    ref: 'sources',
    required: [true, 'A story must have a source!'],
  },
  images: [String],
});

storiesSchema.index({ title: 1, createdAt: 1 });

storiesSchema.pre(/^find/, function (next) {
  this.select('-__v').sort('-createdAt');
  next();
});

storiesSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'categories',
    select: '-__v',
  })
    .populate({
      path: 'tags',
      select: '-__v',
    })
    .populate({
      path: 'source',
      select: '-__v',
    });

  next();
});

storiesSchema.post('save', function () {
  this.populate({
    path: 'tags',
    select: '-__v',
  });
});
storiesSchema.pre('save', function () {
  this.deleteTags = [];
  this.createTags = [];
});

const STORIES = mongoose.model('news', storiesSchema);

module.exports = STORIES;
