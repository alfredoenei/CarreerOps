const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // 1. Datos Base del Kanban
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    isFavorite: { type: Boolean, default: false }, // ⭐ NUEVO: Para seguimiento especial
    tags: [String],

    // 2. Relaciones y Posición
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🛡️ NUEVO: Seguridad Row-Level
    position: { type: Number, required: true },

    // 3. CRM: Datos de la Oferta
    company: { type: String, default: '' },
    salary: { type: String, default: '' },
    location: { type: String, default: '' },
    jobUrl: { type: String, default: '' }, // 🚀 NUEVO: Para la extensión de Chrome

    // 4. CRM: Seguimiento y Estrategia
    resumeUsed: { type: String, default: '' }, // 📄 NUEVO: Qué CV enviaste
    appliedAt: { type: Date, default: null }, // ⏰ NUEVO: Cuándo aplicaste
    nextFollowUp: { type: Date, default: null }, // ⏰ NUEVO: Alerta de seguimiento
    interviewNotes: { type: String, default: '' } // 🧠 NUEVO: Apuntes para la entrevista

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);