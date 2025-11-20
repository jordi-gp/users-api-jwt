import express from 'express';
import UserModel from './Model/User.js';
import {createUserRouter} from './Router/UserRouter.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'ejs');
app.set('views', './Client/views');

app.use(express.json());
app.use(express.static('Client'));

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.use('/users', createUserRouter({userModel: UserModel}));

app.use((req, res) => {
    return res.status(404).render('not-found.ejs');
});

const server = app.listen(PORT, () => {
    console.log(`Aplicación corriendo en el puerto ${PORT}`);
});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCESS':
            console.error(`Permisos requeridos, necessita revisión`);
            break;
        case 'EADDRINUSE':
            console.error(`El puerto ${PORT} ya está en uso`);
            break;
        default:
            console.error('Error al realizar la conexión al servidor:', error.message);
    }

    process.exit(1);
});
