const express = require('express');
const router = express.Router();

const {GetEmailValidity, CreateAccount} = require('../../Servicers/AccountServices.js');

router.get('/SignUp/CheckEmail/:Email', (req, res) => {
    const Email = req.params.Email
    GetEmailValidity(Email).then(response => res.json(response))
})

router.post('/SignUp/CreateAccount', (req, res) => {
    const Data = req.body
    CreateAccount(Data).then(response => res.json(response))
})

module.exports = router;