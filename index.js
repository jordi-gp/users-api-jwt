import express from 'express';
import UserModel from './Model/User.js';
import {createUserRouter} from './Router/UserRouter.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'ejs');
app.set('views', './Client/views');

//#region MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Client'));

app.use((req, res, next) => {
    const token = req.cookies['access_token'];
    req.session = {user: null};

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.session.user = data;
    } catch (e) {}

    next();
});
//#endregion

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/protected', (req, res) => {
    const {user} = req.session;
    if (!user) return res.status(403).send('Not authenticated!');
    res.render('protected.ejs', {user});
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.use('/users', createUserRouter({userModel: UserModel}));

app.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/');
});

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
