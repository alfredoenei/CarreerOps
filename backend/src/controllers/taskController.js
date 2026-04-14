const Task = require('../models/Task');

// GET all tasks for a column (SEGURIZADO)
exports.getTasksByColumn = async (req, res) => {
    try {
        // Solo busca tareas de esa columna QUE PERTENEZCAN al usuario logueado
        const tasks = await Task.find({
            columnId: req.params.columnId,
            userId: req.user.id // 🛡️ Seguridad
        }).sort('position');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all tasks for a board (SEGURIZADO)
exports.getTasksByBoard = async (req, res) => {
    try {
        const tasks = await Task.find({
            boardId: req.params.boardId,
            userId: req.user.id // 🛡️ Seguridad
        }).sort('position');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create a task (ACTUALIZADO PARA CRM - BLINDADO)
exports.createTask = async (req, res) => {
    try {
        // 🛡️ Whitelist: Filtramos los campos permitidos para evitar Mass Assignment
        const allowedFields = ['title', 'description', 'priority', 'isFavorite', 'tags', 'columnId', 'boardId', 'position', 'company', 'salary', 'location', 'jobUrl', 'resumeUsed', 'appliedAt', 'nextFollowUp', 'interviewNotes'];
        const taskData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) taskData[field] = req.body[field];
        });

        const newTask = new Task({
            ...taskData,
            userId: req.user.id, // 🛡️ Inyectamos el dueño de forma segura y controlada
            position: taskData.position || 0
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update task (move or edit) (SEGURIZADO Y BLINDADO)
exports.updateTask = async (req, res) => {
    try {
        // 🛡️ Whitelist: Filtramos los campos permitidos para evitar Mass Assignment
        const allowedFields = ['title', 'description', 'priority', 'isFavorite', 'tags', 'columnId', 'boardId', 'position', 'company', 'salary', 'location', 'jobUrl', 'resumeUsed', 'appliedAt', 'nextFollowUp', 'interviewNotes'];
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });

        // findOneAndUpdate nos permite buscar por ID y por DUEÑO
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // 🛡️ Doble validación
            updateData,
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE task (SEGURIZADO)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id // 🛡️ Solo el dueño puede borrarla
        });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE all tasks in a column (SEGURIZADO)
exports.clearTasks = async (req, res) => {
    try {
        await Task.deleteMany({
            columnId: req.params.columnId,
            userId: req.user.id // 🛡️ Seguridad
        });
        res.json({ message: 'Todas tus tareas eliminadas de la columna' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};