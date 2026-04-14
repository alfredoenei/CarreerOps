const User = require('../models/User');
const Board = require('../models/Board');
const Column = require('../models/Column');

/**
 * Actualiza la configuración de metas diarias (Títulos y Descripciones)
 * @route PUT /api/user/goals
 */
exports.updateDailyGoals = async (req, res) => {
    // El ID viene inyectado por el middleware de auth tras verificar el token
    const userId = req.user.id;
    const { goals } = req.body;

    // Validación defensiva de la entrada
    if (!goals || !Array.isArray(goals)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Se requiere un array de metas (goals) válido.' 
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Mapeo limpio: Evitamos inyectar basura o campos no permitidos
        user.dailyGoals = goals.map(g => ({
            habitId: g.habitId,
            label: (g.label || 'Nueva Meta').trim(),
            text: (g.text || '').trim()
        }));

        // CRÍTICO: Mongoose necesita saber que este array de objetos ha cambiado
        user.markModified('dailyGoals');
        
        await user.save();

        res.json({
            success: true,
            message: 'Configuración de metas sincronizada con éxito',
            dailyGoals: user.dailyGoals
        });
    } catch (error) {
        console.error('SERVER ERROR [updateDailyGoals]:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno al persistir la configuración de metas.' 
        });
    }
};

/**
 * Obtiene la configuración base del usuario (Board y Columna Inbox) para el Clipper
 * @route GET /api/user/setup
 */
exports.getUserSetup = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Buscamos el primer tablero del usuario (Board usa 'owner' como llave foránea)
        let board = await Board.findOne({ owner: userId });
        
        // 🚀 FALLBACK COMPATIBILIDAD (Fase 2): Si el usuario no tiene tablero propio 
        // pero la app está usando el tablero global (seed), nos anclamos a él.
        if (!board) {
            board = await Board.findOne();
        }

        if (!board) {
            return res.status(404).json({ message: 'No se encontró un tablero. Ábrelo en la Web primero.' });
        }

        // Buscamos la primera columna (Inbox) de ese tablero
        const inboxColumn = await Column.findOne({ boardId: board._id }).sort('position');
        if (!inboxColumn) {
            return res.status(404).json({ message: 'No se encontró una columna válida en el tablero.' });
        }

        const user = await User.findById(userId);

        res.json({
            boardId: board._id,
            columnId: inboxColumn._id,
            email: user ? user.email : 'Usuario CareerOps'
        });
    } catch (error) {
        console.error('SERVER ERROR [getUserSetup]:', error);
        res.status(500).json({ message: 'Error interno obteniendo configuración del Clipper.' });
    }
};

