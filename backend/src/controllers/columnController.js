const Column = require('../models/Column');
const Task = require('../models/Task');

// GET all columns for a board
exports.getColumnsByBoard = async (req, res) => {
    try {
        const columns = await Column.find({ boardId: req.params.boardId }).sort('position');
        res.json(columns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create a column
exports.createColumn = async (req, res) => {
    const { title, boardId, position } = req.body;
    try {
        const newColumn = new Column({
            title,
            boardId,
            position: position || 0
        });
        const savedColumn = await newColumn.save();
        res.status(201).json(savedColumn);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update column (title/position)
exports.updateColumn = async (req, res) => {
    try {
        const updatedColumn = await Column.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedColumn) return res.status(404).json({ message: 'Columna no encontrada' });
        res.json(updatedColumn);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE column
exports.deleteColumn = async (req, res) => {
    try {
        const column = await Column.findByIdAndDelete(req.params.id);
        if (!column) return res.status(404).json({ message: 'Columna no encontrada' });
        
        // Cascading delete tasks in this column
        await Task.deleteMany({ columnId: req.params.id });
        
        res.json({ message: 'Columna eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
