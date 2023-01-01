const pool = require('../../../DB.js');

async function DBQuestionsINIT() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Questions(
        QuestionID INTEGER PRIMARY KEY NOT NULL,
        TopicID INTEGER NOT NULL,
        Paper INTEGER NOT NULL,
        SchoolName TEXT,
    
        FOREIGN KEY (TopicID) REFERENCES Topics(TopicID),
        FOREIGN KEY (Paper) REFERENCES Papers(PaperID)
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS QuestionIMGs(
        QuestionIMGID INTEGER PRIMARY KEY NOT NULL,
        QuestionIMGName TEXT NOT NULL,
        QuestionIMGDIR TEXT NOT NULL,
        QuestionID INTEGER NOT NULL,
    
        FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS AnswerIMGs(
        AnswerIMGID INTEGER PRIMARY KEY NOT NULL,
        AnswerIMGName TEXT NOT NULL,
        AnswerIMGDIR TEXT NOT NULL,
        QuestionID INTEGER NOT NULL,
        
        FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
    )`)
}

module.exports = {DBQuestionsINIT}