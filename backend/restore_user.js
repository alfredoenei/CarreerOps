require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kanban-db';

const restoreUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('--- Restaurando Usuario ---');
        
        const email = 'andres@example.com'; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Buscar si existe, si no, crear
        let user = await User.findOne({ email });
        if (user) {
            user.passwordHash = hashedPassword;
            await user.save();
            console.log(`Usuario ${email} actualizado con password: 123456`);
        } else {
            await User.create({
                username: 'Andrés',
                email: email,
                passwordHash: hashedPassword
            });
            console.log(`Usuario ${email} creado con password: 123456`);
        }

        console.log('--- Operación completada ---');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

restoreUser();
