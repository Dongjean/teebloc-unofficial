const express = require('express');
const router = express.Router();

const {
    Get_Account_Info,
    Get_Login_Info,

    Check_Exists_Email_inDB,
    Check_PW_isCorrect,
    Check_Email_isValid,
    Check_OTP_isCorrect,

    Send_OTP,

    Create_Account
} = require('../../Servicers/AccountServices.js');


//Get

router.get('/Accounts/Get/AccountInfo/:Email', (req, res) => {
    const Email = req.params.Email
    
    Get_Account_Info(Email).then(response => res.json(response))
})

router.get('/Accounts/Get/LoginInfo/:Email', (req, res) => { //called if login is successful, create JWT here
    const Email = req.params.Email

    Get_Login_Info(Email).then(response => 
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



//Check

router.get('/Accounts/Check/Exists/Email/inDB/:Email', (req, res) => {
    const Email = req.params.Email

    Check_Exists_Email_inDB(Email).then(response => res.json(response))
})

router.get('/Accounts/Check/PW/isCorrect/:Email/:PW', (req, res) => {
    const Data = req.params

    Check_PW_isCorrect(Data).then(response => res.json(response))
})

router.get('/Accounts/Check/Email/isValid/:Email', (req, res) => {
    const Email = req.params.Email

    Check_Email_isValid(Email).then(response => res.json(response))
})

router.get('/Accounts/Check/OTP/isCorrect/:OTP', (req, res) => {
    const OTP = req.params.OTP

    Check_OTP_isCorrect(OTP).then(response => res.json(response))
})



//Email/OTP

router.post('/Accounts/Email/Send/OTP', (req, res) => {
    const Data = req.body

    Send_OTP(Data).then(response => res.json(response))
})



//Create Account

router.post('/Accounts/Create/Account', (req, res) => {
    const Data = req.body

    Create_Account(Data).then(response => res.json(response))
})


//Logout

router.get('/Accounts/Logout', (req, res) => {
    res
        .clearCookie('Token')
        .clearCookie('LoginEmail')
        .clearCookie('LoginFirstName')
        .clearCookie('LoginLastName')
        .clearCookie('LoginType')
        .json('Cookies removed successfully!')
    //set all the cookies to empty
})

module.exports = router;