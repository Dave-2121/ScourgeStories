const express = require('express');
const { getConfig } = require('../controllers/configController');

const router = express.Router();

router.route('/').get(getConfig);

module.exports = router;
