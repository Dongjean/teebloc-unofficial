const jwt = require('jsonwebtoken');
require('dotenv').config()

//Authorises only Admins Access
async function authAdminJWT(req, res, next) {
    const Token = req.cookies.Token;
    try {
        jwt.verify(Token, process.env.TokenSecret, function(err, decoded) {
            if (err) {
                res.stauts(401).send(err)
            } else {
                if (decoded.AccType == 'Admin') {
                    next()
                } else {
                    console.log('Invalid JWT: You are not authorised as an Admin!')
                }
            }
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports = {authAdminJWT}