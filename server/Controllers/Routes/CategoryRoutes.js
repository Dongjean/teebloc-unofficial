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

    Relink_Topic_Subject,

    Link_Subject_Level,
    Link_Subject_Paper,
    Link_School_Subject,
    Link_Assessment_Level,

    Delete_Subject,
    Delete_Topic,
    Delete_Level,
    Delete_Paper,
    Delete_Assessment,
    Delete_School,

    Rename_Subject,
    Rename_Topic,
    Rename_Level,
    Rename_Paper
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
    const Options = req.query.Options

    Get_Levels_fromAssessmentID(AssessmentID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Assessments/fromLevelID/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID
    const Options = req.query.Options

    Get_Assessments_fromLevelID(LevelID, Options).then(response => res.json(response))
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
    const Options = req.query.Options

    Get_Subjects_fromLevelID(LevelID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromPaperID/:PaperID', (req, res) => {
    const PaperID = req.params.PaperID
    const Options = req.query.Options

    Get_Subjects_fromPaperID(PaperID, Options).then(response => res.json(response))
})

router.get('/Categories/Get/Subjects/fromSchoolID/:SchoolID', (req, res) => {
    const SchoolID = req.params.SchoolID
    const Options = req.query.Options

    Get_Subjects_fromSchoolID(SchoolID, Options).then(response => res.json(response))
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


//Link

router.post('/Categories/Link/Subject/:SubjectID/Level/:LevelID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const LevelID = req.params.LevelID

    Link_Subject_Level(SubjectID, LevelID).then(response => res.json(response))
})

router.post('/Categories/Link/Subject/:SubjectID/Paper/:PaperID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const PaperID = req.params.PaperID

    Link_Subject_Paper(SubjectID, PaperID).then(response => res.json(response))
})

router.post('/Categories/Link/School/:SchoolID/Subject/:SubjectID', (req, res) => {
    const SchoolID = req.params.SchoolID
    const SubjectID = req.params.SubjectID

    Link_School_Subject(SchoolID, SubjectID).then(response => res.json(response))
})

router.post('/Categories/Link/Assessment/:AssessmentID/Level/:LevelID', (req, res) => {
    const AssessmentID = req.params.AssessmentID
    const LevelID = req.params.LevelID
    
    Link_Assessment_Level(AssessmentID, LevelID).then(response => res.json(response))
})


//Delete

router.post('/Categories/Delete/Subject/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID

    Delete_Subject(SubjectID).then(response => res.json(response))
})

router.post('/Categories/Delete/Topic/:TopicID', (req, res) => {
    const TopicID = req.params.TopicID

    Delete_Topic(TopicID).then(response => res.json(response))
})

router.post('/Categories/Delete/Level/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID

    Delete_Level(LevelID).then(response => res.json(response))
})

router.post('/Categories/Delete/Paper/:PaperID', (req, res) => {
    const PaperID = req.params.PaperID

    Delete_Paper(PaperID).then(response => res.json(response))
})

router.post('/Categories/Delete/Assessment/:AssessmentID', (req, res) => {
    const AssessmentID = req.params.AssessmentID

    Delete_Assessment(AssessmentID).then(response => res.json(response))
})

router.post('/Categories/Delete/School/:SchoolID', (req, res) => {
    const SchoolID = req.params.SchoolID

    Delete_School(SchoolID).then(response => res.json(response))
})


//Rename

router.post('/Categories/Rename/Subject/:SubjectID', (req, res) => {
    const SubjectID = req.params.SubjectID
    const New_SubjectName = req.body.New_SubjectName

    Rename_Subject(SubjectID, New_SubjectName).then(response => res.json(response))
})

router.post('/Categories/Rename/Topic/:TopicID', (req, res) => {
    const TopicID = req.params.TopicID
    const New_TopicName = req.body.New_TopicName

    Rename_Topic(TopicID, New_TopicName).then(response => res.json(response))
})

router.post('/Categories/Rename/Level/:LevelID', (req, res) => {
    const LevelID = req.params.LevelID
    const New_LevelName = req.body.New_LevelName

    Rename_Level(LevelID, New_LevelName).then(response => res.json(response))
})

router.post('/Categories/Rename/Paper/:PaperID', (req, res) => {
    const PaperID = req.params.PaperID
    const New_PaperName = req.body.New_PaperName

    Rename_Paper(PaperID, New_PaperName).then(response => res.json(response))
})

module.exports = router;