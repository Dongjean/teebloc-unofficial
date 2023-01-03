const pool = require('../../../DB.js');

async function DBQuestionsINIT() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Questions(
        QuestionID BIGSERIAL PRIMARY KEY NOT NULL,
        TopicID INTEGER NOT NULL,
        PaperID INTEGER NOT NULL,
        LevelID INTEGER NOT NULL,
        AssessmentID INTEGER NOT NULL,
        SchoolName TEXT,
    
        FOREIGN KEY (TopicID) REFERENCES Topics(TopicID),
        FOREIGN KEY (PaperID) REFERENCES Papers(PaperID),
        FOREIGN KEY (LevelID) REFERENCES Levels(LevelID),
        FOREIGN KEY (AssessmentID) REFERENCES Assessments(AssessmentID)
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS QuestionIMGs(
        QuestionIMGID BIGSERIAL PRIMARY KEY NOT NULL,
        QuestionIMGName TEXT NOT NULL,
        QuestionIMGDIR TEXT NOT NULL,
        QuestionID INTEGER NOT NULL,
    
        FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS AnswerIMGs(
        AnswerIMGID BIGSERIAL PRIMARY KEY NOT NULL,
        AnswerIMGName TEXT NOT NULL,
        AnswerIMGDIR TEXT NOT NULL,
        QuestionID INTEGER NOT NULL,
        
        FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
    )`)
}

module.exports = {DBQuestionsINIT}