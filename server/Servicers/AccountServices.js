const pool = require('../DB.js');

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

async function CheckEmailExists(Email) {
    //get the Emails on the DB to check if the requested Email exists
    try {
        const result = await pool.query(`SELECT * FROM Users WHERE Email=$1`, [Email])
        if (result.rows.length == 0) {
            return false //if the Email doesnt yet exist, return false
        } else {
            return true //if the Email exists, return true
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

async function CheckPWCorrect(Data) {
    //check if the PW is correct
    try {
        const result = await pool.query(`SELECT Password FROM Users WHERE Email=$1`, [Data.Email])
        if (result.rows[0].password == Data.PW) {
            return true //if the PW is correct, return true
        } else {
            return false //if PW is wrong, return false
        }
    } catch(err) {
        console.log(err)
    }
}

async function GetLoginInfo(Email) {
    try {
        const result = await pool.query(`SELECT Email, FirstName, LastName, Type FROM Users WHERE Email=$1`, [Email])
        const user = result.rows[0]

        const payload = {
            email: user.email
        }

        const token = await jwt.sign(payload, process.env.TokenSecret) //sign JWT token

        var Info = user
        Info.token = token //add token to response
        return Info
    } catch(err) {
        console.log(err)
    }
}

module.exports = {CheckEmailExists, CreateAccount, CheckPWCorrect, GetLoginInfo};