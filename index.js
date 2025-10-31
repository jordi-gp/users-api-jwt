import express from 'express';
import { createUserRouter } from './Router/UserRouter.js';
import UserModel from './Model/User.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.use("/users", createUserRouter({ userModel: UserModel }))

const server = app.listen(PORT, () => {
    console.log(`Aplicación corriendo en el puerto ${PORT}`);
});

server.on('error', (error) => {
    if(error.syscall !== 'listen') {
        throw error;
    }

    switch(error.code) {
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
