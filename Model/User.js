import { connection } from "../Database/dbConfig.js";
import bcrypt from "bcrypt";
import {
    create,
    generateUUID,
    getAll,
    findOneByEmail,
    findOneByUsername
} from "../Database/querys.js";

export default class UserModel {
    static async getAll() {
        try {
            const [users] = await connection.query(getAll);
            return users;
        } catch (e) {
            throw new Error("Error al obtener los usuarios");
        }
    }

    static async create({ input }) {
        const { name, lastname, username, email, password } = input;

        const [uuidResult] = await connection.query(generateUUID);
        const [{ uuid }] = uuidResult;
        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            const result = await connection.query(create, [
                uuid,
                name,
                lastname,
                username,
                email,
                hashedPassword,
            ]);

            return result;
        } catch (e) {
            throw new Error("Error al registrar el usuario");
        }
    }

    static async login() {}

    static async register() {}

    static async update({ userToUpdate, input }) {
        const keys = Object.keys(input);

        const setClause = keys.map((key) => `${key} = ?`).join(",");
        const values = Object.values(input);

        const query = `UPDATE users SET ${setClause} WHERE username = ?`;

        try {
            const [result] = await connection.query(query, [
                ...values,
                userToUpdate,
            ]);
            return [result];
        } catch (e) {
            throw new Error(e.message);
        }
    }

    static async logout() {}

    static async findOneByUsername({ username }) {
        const user = await connection.query(findOneByUsername, [username]);
        return user[0];
    }

    static async findOneByEmail({ email }) {
        const result = await connection.query(findOneByEmail, [email]);
        return result[0];
    }
}
