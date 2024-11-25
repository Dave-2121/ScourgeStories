const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const Categories = require(`${__dirname}/../models/categoriesModel`);
const Countries = require(`${__dirname}/../models/countriesModel`);
const Source = require(`${__dirname}/../models/sourcesModel`);

const getConfig = catchAsync(async function (req, resp, next) {
  const categories = await Categories.find().select('-__v');
  // const countries = await Countries.find().select('-__v');
  const sources = await Source.find().select('-__v');

  resp.status(200).json({
    status: 'success',
    data: {
      categories,
      sources,
    },
  });
});

module.exports = { getConfig };
