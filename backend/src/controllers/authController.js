const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'El usuario ya existe' });

        user = new User({ username, email, passwordHash: password });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);

        await user.save();

        // Generar JWT
        if (!process.env.JWT_SECRET) {
            console.error("🚨 CRITICAL: JWT_SECRET no está definido.");
            throw new Error('Configuración del servidor incompleta.');
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

        if (!process.env.JWT_SECRET) {
            console.error("🚨 CRITICAL: JWT_SECRET no está definido.");
            throw new Error('Configuración del servidor incompleta.');
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER DATA
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
