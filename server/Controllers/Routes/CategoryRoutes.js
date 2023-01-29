const express = require('express');
const router = express.Router();

const {
    Get_Levels_fromSubjectID,
    Get_Levels_fromAssessmentID,
    Get_Assessments_fromLevelID,
    Get_Assessments_fromLevelIDs,
    Get_Topics_fromSubjectID,
    Get_Papers_fromSubjectID,
    Get_Schools_fromSubjectID,
    Get_Subjects_fromLevelID,
    Get_Subjects_fromPaperID,
    Get_Subjects_fromSchoolID,
    Get_Subjects_fromTopicID,
    
    Get_Subjects_All,
    Get_Topics_All,
    Get_Levels_All,
    Get_Papers_All,
    Get_Schools_All,
    Get_Assessments_All,

    AddNewSubject,
    AddNewTopic,
    AddNewLevel,
    AddNewPaper,
    AddNewAssessment,
    AddNewSchool,
    
    Unlink_Subject_Level,
    Unlink_Subject_Paper,
    Unlink_School_Subject,
    Unlink_Assessment_Level,

    Relink_Topic_Subject
} = require('../../Servicers/CategoryServices.js');

const {authAdminJWT} = require('../../utils/authAdminJWT.js');


//Conditional Get

router.get('/Categories/Get/Levels/fromSubjectID/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const Options = req.query.Options

    Get_Levels_fromSubjectID(SubjectID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Levels/fromAssessmentID/:AssessmentID', (req, res) => {
    const AssessmentID = req.params.AssessmentID

    Get_Levels_fromAssessmentID(AssessmentID).then(response => res.json(response))
})

router.get('/Categories/Get/Assessments/fromLevelID/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID

    Get_Assessments_fromLevelID(LevelID).then(response => res.json(response))
})

router.get('/Categories/Get/Assessments/fromLevels/:LevelIDs', (req, res) => {
    const LevelIDs = JSON.parse(req.params.LevelIDs)

    Get_Assessments_fromLevelIDs(LevelIDs).then(response => res.json(response))
})

router.get('/Categories/Get/Topics/fromSubjectID/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID

    Get_Topics_fromSubjectID(SubjectID).then(response => res.json(response))
})

router.get('/Categories/Get/Papers/fromSubjectID/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const Options = req.query.Options

    Get_Papers_fromSubjectID(SubjectID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Schools/fromSubjectID/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const Options = req.query.Options

    Get_Schools_fromSubjectID(SubjectID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromLevelID/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID

    Get_Subjects_fromLevelID(LevelID).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromPaperID/:PaperID', (req, res) => {
    const PaperID = req.params.PaperID

    Get_Subjects_fromPaperID(PaperID).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromSchoolID/:SchoolID', (req, res) => {
    const SchoolID = req.params.SchoolID

    Get_Subjects_fromSchoolID(SchoolID).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromTopicID/:TopicID', (req, res) => {
    const TopicID = req.params.TopicID

    Get_Subjects_fromTopicID(TopicID).then(response => res.json(response))
})


//GetAll

router.get('/Categories/Get/Subjects/All', (req, res) => {
    Get_Subjects_All().then(response => res.json(response))
})

router.get('/Categories/Get/Topics/All', (req, res) => {
    Get_Topics_All().then(response => res.json(response))
})

router.get('/Categories/Get/Levels/All', (req, res) => {
    Get_Levels_All().then((response => res.json(response)))
})

router.get('/Categories/Get/Papers/All', (req, res) => {
    Get_Papers_All().then((response => res.json(response)))
})

router.get('/Categories/Get/Schools/All', (req, res) => {
    Get_Schools_All().then((response => res.json(response)))
})

router.get('/Categories/Get/Assessments/All', (req, res) => {
    Get_Assessments_All().then((response => res.json(response)))
})


//Add New
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


//Unlink

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


//Relink

router.post('/Categories/Relink/Topic/:TopicID/Subject/:SubjectID', (req, res) => {
    const TopicID = req.params.TopicID
    const SubjectID = req.params.SubjectID

    Relink_Topic_Subject(TopicID, SubjectID).then(response => res.json(response))
})

module.exports = router;