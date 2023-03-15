const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

const {
    Get_Questions_Filtered,
    Get_QuestionData_fromQuestionID,
    Get_Questions_Saved_All,
    Get_Questions_Saved_Filtered,
    Get_Questions_fromAuthor,
    Get_Questions_Completed_All,
    Get_Questions_Completed_Filtered,
    Get_Reports_All,
    Get_Payments_Pending_All,
    Get_Upvotes_Count_fromQuestionID,
    Get_Author_fromQuestionID,
    Get_QuestionData_toEdit_fromQuestionID,
    Get_Questions_Deactivated_All,
    Get_Questions_Deactivated_Filtered,

    Check_Question_isSaved,
    Check_Question_isCompleted,
    Check_Question_isActive,
    Check_Question_isUpvoted,

    Save_Question,
    unSave_Question,

    Complete_Question,
    Uncomplete_Question,
    
    Post_Question,
    Delete_Question,
    Edit_Question,

    Report_Question,
    Resolve_Report,

    Deactivate_Question,
    Activate_Question,

    Pay_Creator,

    Unupvote_Question,
    Upvote_Question
} = require('../../Servicers/QuestionServices.js');
const {authCreatorJWT} = require('../../utils/authCreatorJWT.js');
const {authGeneralJWT} = require('../../utils/authGeneralJWT.js');
const {authAdminJWT} = require('../../utils/authAdminJWT.js');


//Get

router.get('/Questions/Get/Questions/Filtered', (req, res) => {
    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }

    Get_Questions_Filtered(Categories).then(response => res.json(response))
})

router.get('/Questions/Get/QuestionData/fromQuestionID/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_QuestionData_fromQuestionID(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Saved/All/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    Get_Questions_Saved_All(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Saved/Filtered/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Questions_Saved_Filtered(Email, Categories).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/fromAuthor/:Email', authCreatorJWT, (req, res) => {
    const Email = req.params.Email

    Get_Questions_fromAuthor(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Completed/All/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    Get_Questions_Completed_All(Email).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Completed/Filtered/:Email', authGeneralJWT, (req, res) => {
    const Email = req.params.Email

    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Questions_Completed_Filtered(Email, Categories).then(response => res.json(response))
})

router.get('/Questions/Get/Reports/All', authAdminJWT, (req, res) => {
    Get_Reports_All().then(response => res.json(response))
})

router.get('/Questions/Get/Payments/Pending/All', authAdminJWT, (req, res) => {
    Get_Payments_Pending_All().then(response => res.json(response))
})

router.get('/Questions/Get/Upvotes/Count/fromQuestionID/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_Upvotes_Count_fromQuestionID(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/Author/fromQuestionID/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_Author_fromQuestionID(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/QuestionData/toEdit/fromQuestionID/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    Get_QuestionData_toEdit_fromQuestionID(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Deactivated/All', authAdminJWT, (req, res) => {
    Get_Questions_Deactivated_All().then(response => res.json(response))
})

router.get('/Questions/Get/Questions/Deactivated/Filtered', authAdminJWT, (req, res) => {
    //parses through the Categories query string
    const Categories = {
        Topics: JSON.parse(req.query.Topics),
        Levels: JSON.parse(req.query.Levels),
        Papers: JSON.parse(req.query.Papers),
        Assessments: JSON.parse(req.query.Assessments),
        Schools: JSON.parse(req.query.Schools)
    }
    
    Get_Questions_Deactivated_Filtered(Categories).then(response => res.json(response))
})


//Check

router.get('/Questions/Check/Question/isSaved/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Check_Question_isSaved(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/Check/Question/isCompleted/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Check_Question_isCompleted(QuestionID, Email).then(response => res.json(response))
})

router.get('/Questions/Check/Question/isActive/:QuestionID', (req, res) => {
    const QuestionID = req.params.QuestionID

    Check_Question_isActive(QuestionID).then(response => res.json(response))
})

router.get('/Questions/Check/Question/isUpvoted/:QuestionID/:Email', (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Check_Question_isUpvoted(QuestionID, Email).then(response => res.json(response))
})




//Saved

router.post('/Questions/Save/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Save_Question(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Unsave/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    unSave_Question(QuestionID, Email).then(response => res.json(response))
})




//Completed

router.post('/Questions/Complete/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Complete_Question(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Uncomplete/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Uncomplete_Question(QuestionID, Email).then(response => res.json(response))
})



//Post/Delete/Edit Question

router.post('/Questions/Post/Question', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    const FormData = req.body

    Post_Question(FormData).then(response => res.json(response))
})

router.post('/Questions/Delete/Question/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    Delete_Question(QuestionID).then(response => res.json(response))
})

router.post('/Questions/Edit/Question/:QuestionID', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const FormData = req.body

    Edit_Question(QuestionID, FormData).then(response => res.json(response))
})



//Reports


router.post('/Questions/Reports/Report/:QuestionID', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.body.Email
    const ReportText = req.body.ReportText

    Report_Question(QuestionID, Email, ReportText).then(response => res.json(response))
})

router.post('/Questions/Reports/Resolve/:ReportID', authAdminJWT, (req, res) => {
    const ReportID = req.params.ReportID

    Resolve_Report(ReportID).then(response => res.json(response))
})



//Activation

//authorise with Creator authorisor as user must be at least creator or admin ranked in order to deactivate a question
router.post('/Questions/DeActivate/Question/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    Deactivate_Question(QuestionID).then(response => res.json(response))
})

//authorise with Creator authorisor as user must be at least creator or admin ranked in order to activate a question
router.post('/Questions/Activate/Question/:QuestionID', authCreatorJWT, (req, res) => {
    const QuestionID = req.params.QuestionID

    Activate_Question(QuestionID).then(response => res.json(response))
})




//Payments

router.post('/Questions/Payments/Pay/:Email', authAdminJWT, (req, res) => {
    const Email = req.params.Email

    Pay_Creator(Email).then(response => res.json(response))
})




//Upvotes

router.post('/Questions/Upvotes/Unupvote/Question/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Unupvote_Question(QuestionID, Email).then(response => res.json(response))
})

router.post('/Questions/Upvotes/Upvote/Question/:QuestionID/:Email', authGeneralJWT, (req, res) => {
    const QuestionID = req.params.QuestionID
    const Email = req.params.Email

    Upvote_Question(QuestionID, Email).then(response => res.json(response))
})

module.exports = router;