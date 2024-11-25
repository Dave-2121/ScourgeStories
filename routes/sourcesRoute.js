const express = require('express');
const { protect } = require(`${__dirname}/../controllers/authController`);
const { createSource, deleteSource, updateSource } = require(
  `${__dirname}/../controllers/sourcesController`,
);

const router = express.Router();

router.route('/').post(protect, createSource);
router.route('/:id').patch(protect, updateSource).delete(protect, deleteSource);

module.exports = router;
