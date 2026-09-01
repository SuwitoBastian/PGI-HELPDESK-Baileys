const bcrypt = require("bcryptjs");

const db = require("../../database/database");


// ==========================================================
// CREATE USER
// ==========================================================

function createUser({
    username,
    password,
    name
}) {

    const passwordHash =
        bcrypt.hashSync(
            password,
            12
        );


    const result =
        db.prepare(`
            INSERT INTO users (
                username,
                password_hash,
                name,
                aktif
            )
            VALUES (?, ?, ?, 1)
        `).run(
            username,
            passwordHash,
            name
        );


    return {
        id: result.lastInsertRowid,
        username,
        name
    };

}


// ==========================================================
// FIND USER
// ==========================================================

function findByUsername(username) {

    return db.prepare(`
        SELECT
            id,
            username,
            password_hash,
            name,
            aktif
        FROM users
        WHERE username = ?
        LIMIT 1
    `).get(username);

}


// ==========================================================
// VERIFY LOGIN
// ==========================================================

function verifyPassword(
    password,
    passwordHash
) {

    return bcrypt.compareSync(
        password,
        passwordHash
    );

}


module.exports = {

    createUser,

    findByUsername,

    verifyPassword

};