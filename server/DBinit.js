const pool = require('./DB.js');

//create Users table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Users(
    Email TEXT PRIMARY KEY NOT NULL,
    Password TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Type TEXT NOT NULL
)`)

//create Categories table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Categories(
    CategoryID INTEGER PRIMARY KEY NOT NULL,
    Category TEXT NOT NULL
)`)