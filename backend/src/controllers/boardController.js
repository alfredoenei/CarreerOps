const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');

// GET all boards
exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET board by id
exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create a board
exports.createBoard = async (req, res) => {
    const { title, owner } = req.body;
    try {
        // En Fase 2 simulamos el owner temporalmente sin auth
        const newBoard = new Board({
            title,
            owner: owner || '000000000000000000000000' // fake id para pruebas
        });
        const savedBoard = await newBoard.save();
        res.status(201).json(savedBoard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE board
exports.deleteBoard = async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
        
        // Cascading deletes (opcional en fase 2, pero útil)
        await Column.deleteMany({ boardId: req.params.id });
        await Task.deleteMany({ boardId: req.params.id });

        res.json({ message: 'Tablero eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
