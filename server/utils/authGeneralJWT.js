const jwt = require('jsonwebtoken');
require('dotenv').config()

//Authorises any User logged in Access
async function authGeneralJWT(req, res, next) {
    const Token = req.cookies.Token;
    try {
        jwt.verify(Token, process.env.TokenSecret, function(err, decoded) {
            if (err) {
                res.status(401).send(err)
            } else {
                console.log(decoded)
                next()
            }
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports = {authGeneralJWT}