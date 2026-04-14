const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    dailyGoals: {
        type: [
            {
                habitId: { type: Number, required: true },
                label: String,
                text: String,
                _id: false
            }
        ],
        default: [
            { habitId: 1, label: 'Caza Mayor', text: 'Enviar 3 CVs adaptados' },
            { habitId: 2, label: 'Networking', text: 'Contactar a 2 Recruiters' },
            { habitId: 3, label: 'Mantenimiento', text: 'LeetCode o Portfolio' }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
