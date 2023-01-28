const express = require('express');
const router = express.Router();

const {GetAllSubjects, GetLevels, GetAssessments, GetAssessmentsFromLevels, GetTopics, GetPapers, GetSchools, AddNewSubject, AddNewTopic, AddNewLevel, AddNewPaper, AddNewAssessment, AddNewSchool, GetAllLevels, GetAllPapers, GetAllSchools, GetAllAssessments, Unlink_Subject_Level, Unlink_Subject_Paper, Unlink_School_Subject, Unlink_Assessment_Level, Get_Subjects_fromLevelID, Get_Assessments_fromLevelID} = require('../../Servicers/CategoryServices.js');
const {authAdminJWT} = require('../../utils/authAdminJWT.js');

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

router.post('/Categories/New/Subject', authAdminJWT, (req, res) => {
    const Data = req.body
    AddNewSubject(Data).then(response => res.json(response))
})

router.post('/Categories/New/Topic', authAdminJWT, (req, res) => {
    const Data = req.body
    AddNewTopic(Data).then(response => res.json(response))
})

router.post('/Categories/New/Level', authAdminJWT, (req, res) => {
    const Data = req.body
    AddNewLevel(Data).then(response => res.json(response))
})

router.post('/Categories/New/Paper', authAdminJWT, (req, res) => {
    const Data = req.body
    AddNewPaper(Data).then(response => res.json(response))
})

router.post('/Categories/New/Assessment', authAdminJWT, (req, res) => {
    const Data = req.body
    AddNewAssessment(Data).then(response => res.json(response))
})

router.post('/Categories/New/School', authAdminJWT, (req, res) => {
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

router.post('/Categories/Unlink/Subject/:SubjectID/Level/:LevelID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const LevelID = req.params.LevelID
    
    Unlink_Subject_Level(SubjectID, LevelID).then(response => res.json(response))
})

router.post('/Categories/Unlink/Subject/:SubjectID/Paper/:PaperID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const PaperID = req.params.PaperID
    
    Unlink_Subject_Paper(SubjectID, PaperID).then(response => res.json(response))
})

router.post('/Categories/Unlink/School/:SchoolID/Subject/:SubjectID', (req, res) => {
    const SchoolID = req.params.SchoolID
    const SubjectID = req.params.SubjectID
    
    Unlink_School_Subject(SchoolID, SubjectID).then(response => res.json(response))
})

router.post('/Categories/Unlink/Assessment/:AssessmentID/Level/:LevelID', (req, res) => {
    const AssessmentID = req.params.AssessmentID
    const LevelID = req.params.LevelID
    
    Unlink_Assessment_Level(AssessmentID, LevelID).then(response => res.json(response))
})

router.get('/Categories/Subjects/Get/fromLevelID/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID

    Get_Subjects_fromLevelID(LevelID).then(response => res.json(response))
})

router.get('/Categories/Assessments/Get/fromLevelID/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID

    Get_Assessments_fromLevelID(LevelID).then(response => res.json(response))
})

module.exports = router;