const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Obtener token de x-auth-token o Authorization: Bearer <token>
    let token = req.header('x-auth-token');
    
    if (!token && req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    // Verify token
    try {
        if (!process.env.JWT_SECRET) {
            console.error("🚨 CRITICAL: JWT_SECRET no está definido en las variables de entorno.");
            return res.status(500).json({ message: 'Error de configuración del servidor (Auth)' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'El token no es válido' });
    }
};
