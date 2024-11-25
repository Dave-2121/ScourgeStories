const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  iso2: String,
  flags: {
    png: String,
    svg: String,
  },
});

const Countries = mongoose.model('countries', countriesSchema);

module.exports = Countries;
