const jwt = require('jsonwebtoken');
require('dotenv').config()

async function authGeneralJWT(req, res, next) {
    const Token = req.cookies.Token;
    try {
        const result = jwt.verify(Token, process.env.TokenSecret, function(err, decoded) {
            if (err) {
                res.stauts(401).send(err)
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