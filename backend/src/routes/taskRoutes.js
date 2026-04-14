const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware'); // 🛡️ Importamos el candado

// 🛡️ BARRERA DE SEGURIDAD GLOBAL
// Al poner esto aquí, TODAS las rutas debajo de esta línea exigirán un token válido.
router.use(auth);

// Rutas protegidas
router.get('/column/:columnId', taskController.getTasksByColumn);
router.get('/board/:boardId', taskController.getTasksByBoard);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.delete('/clear/:columnId', taskController.clearTasks);

module.exports = router;