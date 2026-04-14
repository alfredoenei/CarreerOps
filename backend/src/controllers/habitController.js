const DailyProgress = require('../models/DailyProgress');
const User = require('../models/User');

// Obtener progreso del día (Fusionado con config del usuario)
exports.getProgress = async (req, res) => {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0];

    try {
        // 1. Obtener configuración de metas del Usuario
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // INICIALIZACIÓN ROBUSTA: Si el usuario no tiene metas, las inyectamos ahora
        let dailyGoals = user.dailyGoals;
        if (!dailyGoals || dailyGoals.length === 0) {
            dailyGoals = [
                { habitId: 1, label: 'Caza Mayor', text: 'Enviar 3 CVs adaptados' },
                { habitId: 2, label: 'Networking', text: 'Contactar a 2 Recruiters' },
                { habitId: 3, label: 'Mantenimiento', text: 'LeetCode o Portfolio' }
            ];
            user.dailyGoals = dailyGoals;
            await user.save();
        }

        // 2. Obtener (o crear) el log de progreso diario (SOLO IDs Y BOOLEANOS)
        let progress = await DailyProgress.findOne({ userId, date });
        
        if (!progress) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = yesterday.toISOString().split('T')[0];
            const yesterdayProgress = await DailyProgress.findOne({ userId, date: yesterdayDate });
            
            progress = new DailyProgress({
                userId,
                date,
                habits: dailyGoals.map(goal => ({
                    habitId: goal.habitId,
                    completed: false
                })),
                streak: yesterdayProgress ? yesterdayProgress.streak : 0
            });
            await progress.save();
        }

        // 3. FUSIÓN INTELIGENTE: Combinamos config del usuario con progreso real
        const consolidatedHabits = dailyGoals.map(goal => {
            const dailyStatus = progress.habits.find(h => h.habitId === goal.habitId);
            return {
                habitId: goal.habitId,
                label: goal.label,
                text: goal.text,
                completed: dailyStatus ? dailyStatus.completed : false
            };
        });

        res.json({
            date: progress.date,
            streak: progress.streak,
            habits: consolidatedHabits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle de un hábito
exports.toggleHabit = async (req, res) => {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0];
    
    // SANITIZACIÓN: Aseguramos que habitId sea un número para evitar fallos de comparación estricta
    const habitId = Number(req.body.habitId);

    if (isNaN(habitId)) {
        return res.status(400).json({ message: 'habitId debe ser un número válido' });
    }

    try {
        let progress = await DailyProgress.findOne({ userId, date });
        
        // LAZY INITIALIZATION: Si no existe el registro de hoy, lo creamos ahora
        if (!progress) {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
            const yesterdayProgress = await DailyProgress.findOne({ userId, date: yesterdayStr });

            progress = new DailyProgress({
                userId,
                date,
                habits: user.dailyGoals.map(goal => ({
                    habitId: goal.habitId,
                    completed: false
                })),
                streak: yesterdayProgress ? yesterdayProgress.streak : 0
            });
            // No guardamos aún, lo haremos después de aplicar el toggle
        }

        const habit = progress.habits.find(h => h.habitId === habitId);
        if (!habit) {
            return res.status(404).json({ message: `Hábito con ID ${habitId} no encontrado en la configuración` });
        }

        // Aplicamos el toggle
        habit.completed = !habit.completed;

        // LÓGICA DE RACHA (STREAK):
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        const allCompleted = progress.habits.every(h => h.completed);
        
        if (allCompleted) {
            const yesterdayProgress = await DailyProgress.findOne({ userId, date: yesterdayStr });
            progress.streak = (yesterdayProgress?.streak || 0) + 1;
        } else {
            const yesterdayProgress = await DailyProgress.findOne({ userId, date: yesterdayStr });
            progress.streak = yesterdayProgress?.streak || 0;
        }

        progress.markModified('habits');
        await progress.save();
        
        res.json(progress);
    } catch (error) {
        console.error('Error en toggleHabit:', error);
        res.status(500).json({ message: 'Error interno al actualizar el hábito', error: error.message });
    }
};
