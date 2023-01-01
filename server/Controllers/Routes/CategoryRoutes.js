const express = require('express');
const router = express.Router();

const {GetAllSubjects} = require('../../Servicers/CategoryServices.js');

router.get('/Categories/Subjects/GetAll', (req, res) => {
    GetAllSubjects().then(response => res.json(response))
})

module.exports = router;