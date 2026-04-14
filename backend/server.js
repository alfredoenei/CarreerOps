require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// 1. Importación exhaustiva de rutas
const boardRoutes = require('./src/routes/boardRoutes');
const columnRoutes = require('./src/routes/columnRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const authRoutes = require('./src/routes/authRoutes');
const habitRoutes = require('./src/routes/habitRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// 2. Middleware de red y parsing (Orden Crítico y Seguro)
// CONFIGURACIÓN CORS: Whitelist dinámica para soportar múltiples puertos de desarrollo y producción
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen o desde extensiones de Chrome
        if (!origin || origin.startsWith('chrome-extension://')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`🚫 CORS Error: El origen ${origin} no está en la whitelist.`);
            callback(new Error('No permitido por CORS'));
        }
    },

    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json()); // Necesario para que req.body no llegue vacío

// 3. LOGGER DE DEBUGGING (Seguro contra fugas de datos)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'PUT' || req.method === 'POST') {
        // SEGURIDAD: Nunca imprimir contraseñas en los logs del servidor
        if (req.url.includes('/auth')) {
            console.log('Payload: [DATOS DE AUTENTICACIÓN OCULTOS 🔒]');
        } else {
            console.log('Payload:', JSON.stringify(req.body, null, 2));
        }
    }
    next();
});

// 4. Conectar a la base de datos
connectDB();

// 5. Montaje de RUTAS (Prefijos verificados)
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/user', userRoutes); // PUNTO CRÍTICO: Aquí vive /api/user/goals

// 6. Manejador Global de Rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.url} no encontrada en este servidor.` });
});

// 7. MANEJADOR GLOBAL DE ERRORES (500) - Red de seguridad final
app.use((err, req, res, next) => {
    console.error('🔥 Error Crítico:', err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        // Solo enviamos el stack trace si estamos en desarrollo local por seguridad
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR LISTO EN PUERTO ${PORT}`);
    console.log(`📡 FRONTEND_URL en .env: ${process.env.FRONTEND_URL || 'No definido (usando whitelist local)'}`);
    console.log(`🛡️  Seguridad CORS dinámica y Manejo de Errores Activado`);
});