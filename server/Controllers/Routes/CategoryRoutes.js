const express = require('express');
const router = express.Router();

const {GetAllSubjects, GetLevels, GetAssessments, GetAssessmentsFromLevels, GetTopics, GetPapers, GetSchools} = require('../../Servicers/CategoryServices.js');

router.get('/Categories/Subjects/GetAll', (req, res) => {
    GetAllSubjects().then(response => res.json(response))
})

router.get('/Categories/Levels/Get/:Subject', (req, res) => {
    const Subject = req.params.Subject
    GetLevels(Subject).then(response => res.json(response))
})

router.get('/Categories/Assessments/Get/:Level', (req, res) => {
    const Level = req.params.Level
    GetAssessments(Level).then(response => res.json(response))
})

router.get('/Categories/Assessments/GetFromLevels/:Levels', (req, res) => {
    const Levels = JSON.parse(req.params.Levels)
    GetAssessmentsFromLevels(Levels).then(response => res.json(response))
})

router.get('/Categories/Topics/Get/:Subject', (req, res) => {
    const Subject = req.params.Subject
    GetTopics(Subject).then(response => res.json(response))
})

router.get('/Categories/Papers/Get/:Subject', (req, res) => {
    const Subject = req.params.Subject
    GetPapers(Subject).then(response => res.json(response))
})

router.get('/Categories/Schools/Get/:Subject', (req, res) => {
    const Subject = req.params.Subject
    GetSchools(Subject).then(response => res.json(response))
})

module.exports = router;