const pool = require('../DB.js');
const transporter = require('../EMail.js');
const emailValidator = require('deep-email-validator');

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const {CreateJWT} = require('../utils/CreateJWT.js');


//Get

async function Get_Account_Info(Email) {
    try {
        console.log(Email, 'hi')
        const result = await pool.query(`SELECT Email, FirstName, LastName, Type FROM Users WHERE Email=$1`, [Email])
        console.log(result.rows[0])
        return result.rows[0]
    } catch(err) {
        console.log(err)
    }
}

async function Get_Login_Info(Email) {
    try {
        const result = await pool.query(`SELECT Email, FirstName, LastName, Type FROM Users WHERE Email=$1`, [Email])
        const user = result.rows[0]

        const Token = CreateJWT(user.email, user.type) //get JWT Token

        var Info = user
        Info.token = Token //add token to response
        return Info
    } catch(err) {
        console.log(err)
    }
}



//Check

async function Check_Exists_Email_inDB(Email) {
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

async function Check_PW_isCorrect(Data) {
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

async function Check_Email_isValid(Email) {
    try {
        return (await emailValidator.validate(Email)).valid
    } catch(err) {
        console.log(err)
    }
}

async function Check_OTP_isCorrect(OTP) {
    try {
        const result = await pool.query(`
        SELECT EXISTS(
            SELECT 1 FROM OTPs WHERE OTP=$1
        )`, [OTP])

        console.log(result.rows[0], OTP)
        
        if (result.rows[0].exists) {
            //get user info to send it back to frontend
            const result_userinfo = await pool.query(`
            SELECT Email, Password, FirstName, LastName FROM OTPs WHERE OTP=$1
            `, [OTP])
            
            var Data = result_userinfo.rows[0]
            Data.isVerified = true

            //since the OTP is valid, delete the OTP from the DB
            await pool.query(`
            DELETE FROM OTPs WHERE OTP=$1
            `, [OTP])

            return Data
        } else {
            return {isVerified: false}
        }
    } catch(err) {
        console.log(err)
    }
}


//Email/OTP

async function Send_OTP(New_User_Data) {
    const OTP = await Get_OTP()

    let mailOptions = {
        from: process.env.EMailUser,
        to: New_User_Data.Email,
        subject: 'Test Mail',
        text: OTP
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully")
        Remember_OTP_Temp(60000, OTP, New_User_Data) //remember the OTP for only 60 seconds
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

async function Get_OTP() {
    //Get all OTPs currently valid from DB
    try {
        const result = await pool.query(`
        SELECT OTP
        FROM OTPs
        `)

        //Generate the OTP
        while (true) {
            var OTP = ''
            //OTP is 6 characters long
            for (var i=0; i<6; i++) {
                OTP += String.fromCharCode(RNG(33, 126))
            }

            if (!result.rows.includes(OTP)) {
                break
            }
        }
        console.log(OTP)
        return OTP
    } catch(err) {
        console.log(err)
    }
}

async function Remember_OTP_Temp(ms, OTP, New_User_Data) {
    try {
        //first check if OTP for this email already exists
        const result = await pool.query(`
        SELECT EXISTS(
            SELECT 1 FROM OTPs WHERE Email=$1
        )`, [New_User_Data.Email])
        if (result.rows[0].exists) {
            //if OTP for this email aready exists, delete them
            await pool.query('DELETE FROM OTPs WHERE Email=$1', [New_User_Data.Email])
        }

        //Remember the new OTP
        await pool.query(`
        INSERT INTO OTPs VALUES($1, $2, $3, $4, $5)
        `, [OTP, New_User_Data.Email, New_User_Data.NewPW, New_User_Data.FirstName, New_User_Data.LastName])
        
        await wait(ms)

        await pool.query(`
        DELETE FROM OTPs WHERE OTP=$1
        `, [OTP])
    } catch(err) {
        console.log(err)
    }
}

function wait(ms) {
    console.log(ms)
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function RNG(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}


//Create Account

async function Create_Account(Data) {
    //add the Account in Data to the DB
    try {
        await pool.query(`INSERT INTO Users VALUES($1, $2, $3, $4, $5)`, [Data.Email, Data.NewPW, Data.FirstName, Data.LastName, Data.Type])
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    Get_Account_Info,
    Get_Login_Info,

    Check_Exists_Email_inDB,
    Check_PW_isCorrect,
    Check_Email_isValid,
    Check_OTP_isCorrect,

    Send_OTP,

    Create_Account
};