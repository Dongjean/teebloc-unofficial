const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

const {Churn, GetQuestionsByID, PostQuestion, SaveQuestion, unSaveQuestion, CheckSavedQuestion, GetSavedQuestions, DeleteQuestion, GetQuestionsByAuthor, CompleteQuestion, UncompleteQuestion, CheckCompletedQuestion, GetCompletedQuestions, Get_Saved_Questions_Filtered, Get_Completed_Questions_Filtered, Report_Question, Get_Reports_All, Resolve_Report, CheckisQuestionActive, DeActivateQuestion, ActivateQuestion, Pay_Creator, Get_All_PendingPayments, Get_Upvotes_Count, Unupvote_Question, Upvote_Question, Check_Upvoted, Get_Question_Author, Get_Question_Data, EditQuestion, GetDeactivatedQuestions, Get_Deactivated_Questions_Filtered} = require('../../Servicers/QuestionServices.js');
const {authCreatorJWT} = require('../../utils/authCreatorJWT.js');
const {authGeneralJWT} = require('../../utils/authGeneralJWT.js');
const {authAdminJWT} = require('../../utils/authAdminJWT.js');

router.get('/Questions/Churn', (req, res) => {
    console.log(req.query)
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

router.get('/Questions/Get/Saved/All/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email
    GetSavedQuestions(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Saved/Filtered/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Saved_Questions_Filtered(Email, Categories).then(response => res.json(response))
})

router.post('/Questions/Delete/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    DeleteQuestion(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/ByAuthor/:Email', authCreatorJWT, (req, res) => {
    const Email = req.params.Email
    GetQuestionsByAuthor(Email).then(response => res.json(response))
})

router.post('/Questions/Complete/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    CompleteQuestion(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Uncomplete/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    UncompleteQuestion(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/CheckCompleted/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email
    CheckCompletedQuestion(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/Get/Completed/All/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email
    GetCompletedQuestions(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Completed/Filtered/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Completed_Questions_Filtered(Email, Categories).then(response => res.json(response))
})

router.post('/Questions/Report/:QuestionID', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.body.Email
    const ReportText = req.body.ReportText

    Report_Question(QuestionID, Email, ReportText).then(response => res.json(response))
})

router.get('/Questions/Get/Reports/All', authAdminJWT, (req, res) => {
    Get_Reports_All().then(response => res.json(response))
})

router.post('/Questions/Reports/Resolve/:ReportID', authAdminJWT, (req, res) => {
    const ReportID = req.params.ReportID

    Resolve_Report(ReportID).then(response => res.json(response))
})

router.get('/Questions/Check/Question/isActive/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    CheckisQuestionActive(QuestionID).then(response => res.json(response))
})

//authorise with Creator authorisor as user must be at least creator or admin ranked in order to deactivate a question
router.post('/Questions/DeActivateQuestion/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    DeActivateQuestion(QuestionID).then(response => res.json(response))
})

//authorise with Creator authorisor as user must be at least creator or admin ranked in order to activate a question
router.post('/Questions/ActivateQuestion/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    ActivateQuestion(QuestionID).then(response => res.json(response))
})

router.post('/Questions/Payments/Pay/:Email', authAdminJWT, (req, res) => {
    const Email = req.params.Email

    Pay_Creator(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Payments/Pending/All', authAdminJWT, (req, res) => {
    Get_All_PendingPayments().then(response => res.json(response))
})

router.get('/Questions/Get/Upvotes/Count/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_Upvotes_Count(QuestionID).then(response => res.json(response))
})

router.post('/Questions/Upvotes/Unupvote/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Unupvote_Question(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Upvotes/Upvote/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Upvote_Question(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/Upvotes/CheckUpvoted/:QuestionID/:Email', (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Check_Upvoted(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/Get/Author/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_Question_Author(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/QuestionData/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_Question_Data(QuestionID).then(response => res.json(response))
})

router.post('/Questions/Edit/Question/:QuestionID', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const FormData = req.body

    EditQuestion(QuestionID, FormData).then(response => res.json(response))
})

router.get('/Questions/Get/Deactivated/All', authAdminJWT, (req, res) => {
    GetDeactivatedQuestions().then(response => res.json(response))
})

router.get('/Questions/Get/Deactivated/Filtered', authAdminJWT, (req, res) => {
    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Deactivated_Questions_Filtered(Categories).then(response => res.json(response))
})

module.exports = router;