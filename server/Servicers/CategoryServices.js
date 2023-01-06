const pool = require("../DB");

async function GetAllSubjects() {
    try {
        const result = await pool.query(`SELECT * FROM Subjects ORDER BY Subject ASC`) //get all categories ordered in alphabetical order
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetLevels(Subject) {
    try {
        const result = await pool.query(`
        SELECT Levels.LevelID, Levels.Level
        FROM Levels JOIN Subject_Level
        ON Levels.LevelID = Subject_Level.LevelID
        WHERE Subject_Level.SubjectID = $1
        `, [Subject])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetAssessments(Level) {
    try {
        const result = await pool.query(`
        SELECT Assessments.AssessmentID, Assessments.AssessmentName
        FROM Assessments JOIN Assessment_Level
        ON Assessments.AssessmentID = Assessment_Level.AssessmentID
        WHERE Assessment_Level.LevelID = $1
        `, [Level])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetAssessmentsFromLevels(Levels) {
    try {
        const result = await pool.query(`
        SELECT DISTINCT Assessments.AssessmentID, Assessments.AssessmentName
        FROM Assessments JOIN Assessment_Level
        ON Assessments.AssessmentID = Assessment_Level.AssessmentID
        WHERE Assessment_Level.LevelID = ANY($1::int[])
        `, [Levels])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetTopics(Subject) {
    try {
        const result = await pool.query(`
        SELECT TopicID, TopicName
        FROM Topics
        WHERE SubjectID = $1
        `, [Subject])
        return result.rows
    } catch(err) {

    }
}

async function GetPapers(Subject) {
    try {
        const result = await pool.query(`
        SELECT Papers.PaperID, Papers.Paper
        FROM Papers JOIN Subject_Paper
        ON Papers.PaperID = Subject_Paper.PaperID
        WHERE Subject_Paper.SubjectID = $1
        `, [Subject])
        console.log(result.rows)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

module.exports = {GetAllSubjects, GetLevels, GetAssessments, GetAssessmentsFromLevels, GetTopics, GetPapers};