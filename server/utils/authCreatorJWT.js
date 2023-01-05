const jwt = require('jsonwebtoken');
require('dotenv').config()

async function authCreatorJWT(req, res, next) {
    const Token = req.cookies.Token;
    try {
        const result = await jwt.verify(Token, process.env.TokenSecret)
        if (result.AccType == 'Creator' || result.AccType == 'Admin') {
            console.log('Posted!')
            next()
        } else {
            console.log('Invalid JWT: You are not authorised to Post Questions!')
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = {authCreatorJWT}