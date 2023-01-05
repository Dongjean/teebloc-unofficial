const jwt = require('jsonwebtoken');
require('dotenv').config()

function CreateJWT(email, AccType) {
    console.log(AccType)
    const payload = {
        email: email,
        AccType: AccType
    }
    const Token = jwt.sign(payload, process.env.TokenSecret)
    
    return Token
}

module.exports = {CreateJWT}