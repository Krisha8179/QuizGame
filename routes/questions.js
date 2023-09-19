const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question');

router.get('/question/random-question', questionController.getQuestion);

module.exports = router;