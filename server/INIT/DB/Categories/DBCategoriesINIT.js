const pool = require('../../../DB.js');

async function DBCategoriesINIT() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Subjects(
        SubjectID INTEGER PRIMARY KEY NOT NULL,
        Subject TEXT NOT NULL
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Levels(
        LevelID INTEGER PRIMARY KEY NOT NULL,
        Level TEXT NOT NULL
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Subject_Level(
        SubjectID INTEGER NOT NULL,
        LevelID INTEGER NOT NULL,
    
        PRIMARY KEY (SubjectID, LevelID),
    
        FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID),
        FOREIGN KEY (LevelID) REFERENCES Levels(LevelID)
    )`) //Certain Subjects only exist at certain Levels, e.g. Economics only exist from JC1 onwards
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Assessments(
        AssessmentID INTEGER PRIMARY KEY NOT NULL,
        AssessmentName TEXT NOT NULL
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Assessment_Level(
        AssessmentID INTEGER NOT NULL,
        LevelID INTEGER NOT NULL,
    
        PRIMARY KEY (AssessmentID, LevelID),
    
        FOREIGN KEY (AssessmentID) REFERENCES Assessments(AssessmentID),
        FOREIGN KEY (LevelID) REFERENCES Levels(LevelID)
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Topics(
        TopicID INTEGER PRIMARY KEY NOT NULL,
        TopicName TEXT NOT NULL,
        SubjectID INTEGER NOT NULL,
    
        FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID)
    )`)

    await pool.query(`
    CREATE TABLE IF NOT EXISTS Papers(
        PaperID INTEGER PRIMARY KEY NOT NULL,
        Paper INTEGER NOT NULL
    )`)
    
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Subject_Paper(
        SubjectID INTEGER NOT NULL,
        PaperID INTEGER NOT NULL,

        PRIMARY KEY (SubjectID, PaperID),
        
        FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID),
        FOREIGN KEY (PaperID) REFERENCES Papers(PaperID)
    )`)
}

module.exports = {DBCategoriesINIT}