import { validateUser, validatePartialUser } from "../Schemas/users.js";
import bcrypt from "bcrypt";

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    async #checkUsername(username) {
        const userResult = await this.userModel.findOneByUsername({ username });

        if (userResult.length >= 1) {
            throw new Error("Usuario ya registrado");
        }
    }

    async #checkEmail(email) {
        const userEmailResult = await this.userModel.findOneByEmail({ email });

        if (userEmailResult.length >= 1) {
            throw new Error("Correo ya registrado");
        }
    }

    getAll = async (req, res) => {
        const result = await this.userModel.getAll();
        res.json(result);
    };

    create = async (req, res) => {
        const result = validateUser(req.body);

        const username = result.data.username;
        const email = result.data.email;

        await this.#checkUsername(username);
        await this.#checkEmail(email);

        if (result.error) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) });
        }

        try {
            await this.userModel.create({ input: result.data });
            return res
                .status(201)
                .json({ message: "Usuario registrado con éxito" });
        } catch (e) {
            return res
                .status(500)
                .send({ error: "Error al crear un usuario nuevo" });
        }
    };

    update = async (req, res) => {
        const result = validatePartialUser(req.body);
        const { userToUpdate } = req.params;

        //#region VALIDACIONES
        if (result.error) {
            return res
                .status(400)
                .json({ error: "Error al actualizar al usuario" });
        }

        if (result.data.username !== undefined) {
            try {
                await this.#checkUsername(result.data.username);
            } catch (e) {
                return res.status(500).json({ error: e.message });
            }
        }

        if (result.data.email !== undefined) {
            try {
                await this.#checkEmail(result.data.email);
            } catch (e) {
                return res.status(500).json({ error: e.message });
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
                .send({ message: "Usuario actualizado con éxito!" });
        } catch (e) {
            return res
                .status(500)
                .send({ error: "Error al actualizar el usuario!" });
        }
    };

    login = async (req, res) => {
        const { username, password } = req.body;

        try {
            const usernameResult = await this.userModel.findOneByUsername({username});

            if (usernameResult.length <= 0) throw new Error("Credenciales incorrectas, reviselas");

            const isValid = await bcrypt.compare(
                password,
                usernameResult[0].password
            );

            if(!isValid) throw new Error("Contraseña incorrecta, vuelva a intentarlo");

            res.send("LOGIN");
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    };

    logout = async (req, res) => {
        //TODO: Destruir la sesión/cookies y cerrar la sesión
        res.send("LOGOUT");
    };
}
