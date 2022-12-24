const nodemailer = require('nodemailer');

const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMailService,
    auth: {
        user: process.env.EMailUser,
        pass: process.env.EMailAppPW
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('bruh')

module.exports = transporter;