const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  icon: String,
});

const Categories = mongoose.model('categories', categoriesSchema);

module.exports = Categories;
