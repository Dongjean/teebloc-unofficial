const express = require('express');
const router = express.Router();

const {GetAllSubjects, GetLevels, GetAssessments, GetAssessmentsFromLevels, GetTopics, GetPapers, GetSchools, AddNewSubject, AddNewTopic, AddNewLevel, AddNewPaper, AddNewAssessment, AddNewSchool, GetAllLevels, GetAllPapers, GetAllSchools, GetAllAssessments} = require('../../Servicers/CategoryServices.js');

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

router.post('/Categories/New/Subject', (req, res) => {
    const Data = req.body
    AddNewSubject(Data).then(response => res.json(response))
})

router.post('/Categories/New/Topic', (req, res) => {
    const Data = req.body
    AddNewTopic(Data).then(response => res.json(response))
})

router.post('/Categories/New/Level', (req, res) => {
    const Data = req.body
    AddNewLevel(Data).then(response => res.json(response))
})

router.post('/Categories/New/Paper', (req, res) => {
    const Data = req.body
    AddNewPaper(Data).then(response => res.json(response))
})

router.post('/Categories/New/Assessment', (req, res) => {
    const Data = req.body
    AddNewAssessment(Data).then(response => res.json(response))
})

router.post('/Categories/New/School', (req, res) => {
    const Data = req.body
    AddNewSchool(Data).then(response => res.json(response))
})

router.get('/Categories/Levels/GetAll', (req, res) => {
    GetAllLevels().then((response => res.json(response)))
})

router.get('/Categories/Papers/GetAll', (req, res) => {
    GetAllPapers().then((response => res.json(response)))
})

router.get('/Categories/Schools/GetAll', (req, res) => {
    GetAllSchools().then((response => res.json(response)))
})

router.get('/Categories/Assessments/GetAll', (req, res) => {
    GetAllAssessments().then((response => res.json(response)))
})

module.exports = router;