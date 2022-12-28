const express = require('express');
const router = express.Router();

const {CheckEmailExists, CreateAccount, CheckPWCorrect, GetLoginInfo} = require('../../Servicers/AccountServices.js');

router.get('/SignUp/CheckEmail/:Email', (req, res) => {
    const Email = req.params.Email
    CheckEmailExists(Email).then(response => res.json(response))
})

router.post('/SignUp/CreateAccount', (req, res) => {
    const Data = req.body
    CreateAccount(Data).then(response => res.json(response))
})

router.get('/Login/CheckEmail/:Email', (req, res) => {
    const Email = req.params.Email
    CheckEmailExists(Email).then(response => res.json(response))
})

router.get('/Login/CheckPW/:Email/:PW', (req, res) => {
    const Data = req.params
    CheckPWCorrect(Data).then(response => res.json(response))
})

router.get('/Login/GetLoginInfo/:Email', (req, res) => { //called if login is successful, create JWT here
    const Email = req.params.Email
    GetLoginInfo(Email).then(response => res.json(response))
})

module.exports = router;