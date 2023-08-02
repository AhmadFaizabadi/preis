
const express = require('express');
const router = express.Router();
const dataController = require('../../controllers/data.controller');

router.route('/').get(dataController.

module.exports = router;
