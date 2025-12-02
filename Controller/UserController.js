import {validateUser, validatePartialUser} from "../Schemas/users.js";
import bcrypt from "bcrypt";

export class UserController {
    constructor({userModel}) {
        this.userModel = userModel;
    }

    async #checkUsername(username) {
        try {
            const userResult = await this.userModel.findOneByUsername({username});

            if (userResult.length >= 1) {
                throw new Error("Usuario ya registrado");
            }
        } catch (e) {
            throw new Error("Usuario ya existe");
        }
    }

    async #checkEmail(email) {
        try {
            const userEmailResult = await this.userModel.findOneByEmail({email});

            if (userEmailResult.length >= 1) {
                throw new Error("Correo ya registrado");
            }
        } catch (e) {
            throw new Error("El correo ya existe");
        }
    }

    getAll = async (req, res) => {
        try {
            const result = await this.userModel.getAll();
            res.json(result);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    };

    getOneByUsername = async (req, res) => {
        try {
            const { username } = req.params;
            const result = await this.userModel.findOneByUsername(username);

            if (result.length <= 0) {
                return res.status(404).json({message: "Usuario no encontrado"});
            }

            res.json(result);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    create = async (req, res) => {
        const result = validateUser(req.body);

        const username = result.data.username;
        const email = result.data.email;

        try {
            await this.#checkUsername(username);
            await this.#checkEmail(email);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }

        if (result.error) {
            return res
                .status(400)
                // .json({error: JSON.parse(result.error.message)});
                .json({message: 'ERROR AL CREAR USUARIO'});
        }

        try {
            await this.userModel.create({input: result.data});
            return res
                .status(201)
                .json({message: "Usuario registrado con éxito"});
        } catch (e) {
            return res
                .status(500)
                .send({error: "Error al crear un usuario nuevo"});
        }
    };

    update = async (req, res) => {
        const result = validatePartialUser(req.body);
        const {userToUpdate} = req.params;

        //#region VALIDACIONES
        if (result.error) {
            return res
                .status(400)
                .json({error: "Error al actualizar al usuario"});
        }

        if (result.data.username !== undefined) {
            try {
                await this.#checkUsername(result.data.username);
            } catch (e) {
                return res.status(500).json({error: e.message});
            }
        }

        if (result.data.email !== undefined) {
            try {
                await this.#checkEmail(result.data.email);
            } catch (e) {
                return res.status(500).json({error: e.message});
            }
        }

        if (result.data.password !== undefined) {
            const hashedPassword = await bcrypt.hash(result.data.password, 10);
            result.data.password = hashedPassword;
        }
        //#endregion

        try {
            await this.userModel.update({
                userToUpdate,
                input: result.data,
            });

            return res
                .status(201)
                .send({message: "Usuario actualizado con éxito!"});
        } catch (e) {
            return res
                .status(500)
                .send({error: "Error al actualizar el usuario!"});
        }
    };

    login = async (req, res) => {
        const {username, password} = req.body;

        try {
            const usernameResult = await this.userModel.findOneByUsername(username);

            if (usernameResult.length <= 0) throw new Error("Credenciales incorrectas, reviselas");

            const isValid = await bcrypt.compare(
                password,
                usernameResult[0].password
            );

            if (!isValid) throw new Error("Contraseña incorrecta, vuelva a intentarlo");

            res.status(201).json({username: usernameResult[0].username});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    };

    logout = async (req, res) => {
        //TODO: Destruir la sesión/cookies y cerrar la sesión
        res.send("LOGOUT");
    };
}
