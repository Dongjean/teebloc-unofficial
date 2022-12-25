const express = require('express');
const router = express.Router();

const {Churn} = require('../../Servicers/QuestionServices.js');

router.get('/Questions/Churn/:Cats', (req, res) => {
    const Cats = JSON.parse(req.params.Cats)
    Churn(Cats).then(response => res.json(response))
})

module.exports = router;