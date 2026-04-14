const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    position: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Column', columnSchema);
