const pool = require('../../../DB.js');

async function DBAccountsINIT() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Users(
        Email TEXT PRIMARY KEY NOT NULL,
        Password TEXT NOT NULL,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Type TEXT NOT NULL
    )`)
}

module.exports = {DBAccountsINIT}