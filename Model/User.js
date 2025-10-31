import { connection } from "../Database/dbConfig.js";
import crypto from "crypto";

const generateUUID = `SELECT UUID() AS uuid`;

const getAll = `SELECT *, BIN_TO_UUID(id) FROM usersdb.users`;

const create = `
    INSERT INTO usersdb.users (
        id,
        name,
        lastname,
        username,
        email,
        password,
        salt
    ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);
`;

const findOneByUsername = `
    SELECT * FROM usersdb.users
    WHERE username = ?;
`;

const findOneByEmail = `
    SELECT * FROM usersdb.users
    WHERE email = ?;
`;

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

    return { salt, hash };
}

export default class UserModel {
    static async getAll() {
        try {
            const [users] = await connection.query(getAll);
            return users;
        } catch(e) {
            throw new Error('Error al obtener los usuarios');
        }
    }
    
    static async create({ input }) {
        const { name, lastname, username, email, password } = input;

        const [uuidResult] = await connection.query(generateUUID);
        const [{ uuid }] = uuidResult;
        const { salt, hash } = hashPassword(password);

        try {
            const result = await connection.query(create, [
                uuid,
                name,
                lastname,
                username,
                email,
                hash,
                salt,
            ]);

            return result;
        } catch (e) {
            console.error(e.message);
            throw new Error("Error al registrar el usuario");
        }
    }

    static async login() {}

    static async register() {}

    static async update() {}

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
