const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Tags = mongoose.model('tags', tagsSchema);

module.exports = Tags;
