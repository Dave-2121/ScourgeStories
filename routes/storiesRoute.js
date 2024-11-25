const express = require('express');
const router = express.Router();

const {
  getAllStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
} = require(`${__dirname}/../controllers/storiesController`);
const { protect } = require(`${__dirname}/../controllers/authController`);

router.route('/').get(getAllStories).post(protect, createStory);

router
  .route('/:id')
  .get(protect, getStory)
  .delete(protect, deleteStory)
  .patch(protect, updateStory);

module.exports = router;
