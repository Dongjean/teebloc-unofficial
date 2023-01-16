const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

const {Churn, PostQuestion} = require('../../Servicers/QuestionServices.js');
const {authCreatorJWT} = require('../../utils/authCreatorJWT.js');

router.get('/Questions/Churn', (req, res) => {
    console.log(req.query.Schools)
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

router.post('/Questions/PostQuestion', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    const FormData = req.body
    PostQuestion(FormData).then(response => res.json(response))

})

module.exports = router;