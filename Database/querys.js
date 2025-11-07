export const create = `
    INSERT INTO usersdb.users (
        id,
        name,
        lastname,
        username,
        email,
        password
    ) VALUES (
        UUID_TO_BIN(?),
        ?,
        ?,
        ?,
        ?,
        ?
    );
`;

export const generateUUID = `SELECT UUID() AS uuid`;

export const getAll = `SELECT *, BIN_TO_UUID(id) FROM usersdb.users`;

export const findOneByUsername = `
    SELECT * FROM usersdb.users
    WHERE username = ?;
`;

export const findOneByEmail = `
    SELECT * FROM usersdb.users
    WHERE email = ?;
`;
