const pool = require('../DB.js');

const dotenv = require("dotenv");
dotenv.config();

async function GetEmailValidity(Email) {
    //get the Emails on the DB to check if the requested Email already exists
    try {
        const result = await pool.query(`SELECT * FROM Users WHERE Email=$1`, [Email])
        if (result.rows.length == 0) {
            return true //if the Email doesnt yet exist, this Email passes this validity check
        } else {
            return false //if the Email already exists, this Email is invalid
        }
    } catch(err) {
        console.log(err)
    }
}

async function CreateAccount(Data) {
    //add the Account in Data to the DB
    try {
        await pool.query(`INSERT INTO Users VALUES($1, $2, $3, $4, $5)`, [Data.Email, Data.NewPW, Data.FirstName, Data.LastName, Data.Type])
    } catch(err) {
        console.log(err)
    }
}

module.exports = {GetEmailValidity, CreateAccount};