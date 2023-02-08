const jwt = require('jsonwebtoken');
require('dotenv').config()

//Authorises both Admins and Creators Access
async function authCreatorJWT(req, res, next) {
    const Token = req.cookies.Token;
    try {
        jwt.verify(Token, process.env.TokenSecret, function(err, decoded) {
            if (err) {
                res.status(401).send(err)
            } else {
                if (decoded.AccType == 'Creator' || decoded.AccType == 'Admin') {
                    next()
                } else {
                    console.log('Invalid JWT: You are not authorised as a Creator!')
                }
            }
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports = {authCreatorJWT}