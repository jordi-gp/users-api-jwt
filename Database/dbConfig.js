import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

export const connection = await mysql.createConnection(dbConfig);

const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
        id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
        name VARCHAR(255) NOT NULL,
        lastname VARCHAR(255),
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

export async function createUsersTable() {
    try {
        const [result] = await connection.query(createUserTableQuery);
        console.log('TABLA CREADA CON ÉXITO');
        return result;
    } catch(e) {
        console.error(e.message);
        return;
    }
}
