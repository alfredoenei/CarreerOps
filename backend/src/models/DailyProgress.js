const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Generado como YYYY-MM-DD
        required: true
    },
    habits: [
        {
            habitId: { type: Number, required: true },
            completed: { type: Boolean, default: false },
            _id: false // Evitar confusión entre _id generado y habitId numérico
        }
    ],
    streak: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Índice compuesto para asegurar un solo registro por usuario/día
dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyProgress', dailyProgressSchema);
