const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

const {Churn, GetQuestionsByID, PostQuestion, SaveQuestion, unSaveQuestion, CheckSavedQuestion, GetSavedQuestions} = require('../../Servicers/QuestionServices.js');
const {authCreatorJWT} = require('../../utils/authCreatorJWT.js');
const {authGeneralJWT} = require('../../utils/authGeneralJWT.js');

router.get('/Questions/Churn', (req, res) => {
    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    Churn(Categories).then(response => res.json(response))
})

router.get('/Questions/Get/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID
    GetQuestionsByID(QuestionID).then(response => res.json(response))
})

router.post('/Questions/PostQuestion', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    const FormData = req.body
    PostQuestion(FormData).then(response => res.json(response))

})

router.post('/Questions/Save/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    SaveQuestion(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Unsave/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    unSaveQuestion(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/CheckSaved/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    CheckSavedQuestion(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/GetSaved/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email
    GetSavedQuestions(Email).then(response => res.json(response))
})

module.exports = router;