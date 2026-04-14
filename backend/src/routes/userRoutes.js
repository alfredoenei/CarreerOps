const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

/**
 * @route   PUT /api/user/goals
 * @desc    Actualiza la configuración de metas diarias (Títulos/Descripciones)
 * @access  Privado (Requiere Token)
 */
router.put('/goals', auth, userController.updateDailyGoals);

/**
 * @route   GET /api/user/setup
 * @desc    Obtiene configuración del usuario para extensiones externas
 * @access  Privado (Requiere Token)
 */
router.get('/setup', auth, userController.getUserSetup);

module.exports = router;
