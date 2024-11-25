const mongoose = require('mongoose');

const sourcesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  source_url: {
    type: String,
    required: true,
  },
});

const Source = mongoose.model('sources', sourcesSchema);

module.exports = Source;
