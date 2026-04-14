const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const habitController = require('../controllers/habitController');

// @route   GET api/habits
// @desc    Get daily habits progress
// @access  Private
router.get('/', auth, habitController.getProgress);

// @route   POST api/habits/toggle
// @desc    Toggle a habit completion
// @access  Private
router.post('/toggle', auth, habitController.toggleHabit);

module.exports = router;
