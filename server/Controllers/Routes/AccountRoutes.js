const express = require('express');
const router = express.Router();

const {CheckEmailExists, CreateAccount, CheckPWCorrect, GetLoginInfo, GetAccInfo} = require('../../Servicers/AccountServices.js');

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
    GetLoginInfo(Email).then(response => 
        res
            .cookie('Token', response.token, {httpOnly: true})
            .cookie('LoginEmail', response.email)
            .cookie('LoginFirstName', response.firstname)
            .cookie('LoginLastName', response.lastname)
            .cookie('LoginType', response.type)
            .json('Cookies set successfully!')
        //set all the cookies in the response
    )
})

router.get('/Login/Logout', (req, res) => {
    res
        .clearCookie('Token')
        .clearCookie('LoginEmail')
        .clearCookie('LoginFirstName')
        .clearCookie('LoginLastName')
        .clearCookie('LoginType')
        .json('Cookies removed successfully!')
    //set all the cookies to empty
})

router.get('/Accounts/GetInfo/:Email', (req, res) => {
    const Email = req.params.Email
    console.log(Email)
    GetAccInfo(Email).then(response => res.json(response))
})

module.exports = router;