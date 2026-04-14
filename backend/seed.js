require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Board = require('./src/models/Board');
const Column = require('./src/models/Column');
const Task = require('./src/models/Task');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kanban-db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('--- Limpiando Base de Datos ---');
        // await Board.deleteMany({});
        // await Column.deleteMany({});
        // await Task.deleteMany({});
        // await User.deleteMany({});

        // Generar hash real para el login
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // 1. Crear usuario por defecto
        const defaultUser = await User.create({
            username: 'Alex Rodriguez',
            email: 'alex@careerops.com',
            passwordHash: hashedPassword 
        });

        // 2. Crear tablero
        const board = await Board.create({
            title: 'My Career Search',
            owner: defaultUser._id
        });

        // 3. Crear columnas CareerOps
        const col1 = await Column.create({ title: 'Applied', boardId: board._id, position: 0 });
        const col2 = await Column.create({ title: 'Interviewing', boardId: board._id, position: 1 });
        const col3 = await Column.create({ title: 'Offers', boardId: board._id, position: 2 });
        const col4 = await Column.create({ title: 'Favoritos', boardId: board._id, position: 3 });

        // 4. Crear tareas de ejemplo (Réplica de la imagen)
        const sampleTasks = [
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'high',
                columnId: col1._id, boardId: board._id, position: 0 
            },
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'high',
                columnId: col1._id, boardId: board._id, position: 1 
            },
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'medium',
                columnId: col2._id, boardId: board._id, position: 0 
            },
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'medium',
                columnId: col2._id, boardId: board._id, position: 1 
            },
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'high',
                columnId: col3._id, boardId: board._id, position: 0 
            },
            { 
                title: 'Senior Full-Stack Engineer', 
                company: 'TECH CORP',
                salary: '$110k-$130k',
                location: 'Remote',
                priority: 'high',
                columnId: col3._id, boardId: board._id, position: 1 
            },
            { 
                title: 'Lead Architect', 
                company: 'GLOBAL SYSTEMS',
                salary: '$150k+',
                location: 'Hybrid',
                priority: 'high',
                columnId: col4._id, boardId: board._id, position: 0 
            },
            { 
                title: 'Frontend Lead', 
                company: 'INNOVATE UI',
                salary: '$120k-$140k',
                location: 'Remote',
                priority: 'medium',
                columnId: col4._id, boardId: board._id, position: 1 
            }
        ];

        await Task.create(sampleTasks);

        console.log('--- CareerOps Seeds insertados correctamente con password: 123456 ---');
        process.exit();
    } catch (error) {
        console.error('Error al insertar seeds:', error);
        process.exit(1);
    }
};

seedData();
