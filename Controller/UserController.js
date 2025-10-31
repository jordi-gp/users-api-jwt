import { validateUser, validatePartialUser } from "../Schemas/users.js";

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    async #checkUsername(username) {
        const userResult = await this.userModel.findOneByUsername({ username });

        if(userResult.length >= 1) {
            throw new Error('Usuario ya registrado');
        }
    }

    async #checkEmail(email) {
        const userEmailResult = await this.userModel.findOneByEmail({ email });

        if(userEmailResult.length >= 1) {
                throw new Error('Correo ya registrado');
        }
    }

    getAll = async(req, res) => {
        const result = await this.userModel.getAll();
        console.log(result);
        res.json(result);
    }

    create = async(req, res) => {
        const result = validateUser(req.body);
    
        const username = result.data.username;
        const email = result.data.email;

        this.#checkUsername(username);
        this.#checkEmail(email);

        if(result.error) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) });
        }

        try {
            await this.userModel.create({ input: result.data });
            return res.status(201).json({ message: "Usuario registrado con éxito" });
        } catch(e) {
            return res.status(500).send({ error: "Error al crear un usuario nuevo" });
        }
    };

    update = async(req, res) => {
        const result = validatePartialUser(req.body);

        if(result.error) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) });
        }
        console.log(req.body);
        res.send('UPDATE');
    };
    
    login = async(req, res) => {
        const { email } = req.body;

        const emailResult = await this.userModel.findOneByEmail({ email });

        if(emailResult <= 0) throw new Error('Credenciales incorrectas, reviselas');

        //TODO: Devolver el usuario con su token y cookies
        res.send('LOGIN');
    };
    
    logout = async(req, res) => {
        //TODO: Destruir la sesión/cookies y cerrar la sesión
        res.send('LOGOUT');
    };
}
