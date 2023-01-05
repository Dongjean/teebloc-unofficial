const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

const {Churn, PostQuestion} = require('../../Servicers/QuestionServices.js');
const { authCreatorJWT } = require('../../utils/authCreatorJWT.js');

router.get('/Questions/Churn/:Cats', (req, res) => {
    const Cats = JSON.parse(req.params.Cats)
    Churn(Cats).then(response => res.json(response))
})

router.post('/Questions/PostQuestion', fileUpload({createParentPath: true}), authCreatorJWT, (req, res) => {
    console.log(req.headers)
    const FormData = req.body
    PostQuestion(FormData).then(response => res.json(response))

})

module.exports = router;