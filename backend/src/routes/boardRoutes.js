const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getBoards);
router.get('/:id', boardController.getBoardById);
router.post('/', boardController.createBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
