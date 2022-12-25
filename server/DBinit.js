const pool = require('./DB.js');

//create Users table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Users(
    Email TEXT PRIMARY KEY NOT NULL,
    Password TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Type TEXT NOT NULL
)`)

//create Categories table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Categories(
    CategoryID INTEGER PRIMARY KEY NOT NULL,
    Category TEXT NOT NULL
)`)

//create QuestionIMGs if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS QuestionIMGs(
    QuestionIMGID INTEGER PRIMARY KEY NOT NULL,
    QuestionIMGName TEXT NOT NULL,
    QuestionIMGDIR TEXT NOT NULL
)`)

//create AnswerIMGs if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS AnswerIMGs(
    AnswerIMGID INTEGER PRIMARY KEY NOT NULL,
    AnswerIMGName TEXT NOT NULL,
    AnswerIMGDIR TEXT NOT NULL
)`)

//create Answers table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Answers(
    AnswerID INTEGER PRIMARY KEY NOT NULL,
    Answer TEXT NOT NULL,
    AnswerIMGID INTEGER,

    FOREIGN KEY (AnswerIMGID) REFERENCES AnswerIMGs(AnswerIMGID)
)`)

//create Questions table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS Questions(
    QuestionID INTEGER PRIMARY KEY NOT NULL,
    Question TEXT NOT NULL,
    QuestionIMGID INTEGER,
    AnswerID INTEGER NOT NULL,

    FOREIGN KEY (QuestionIMGID) REFERENCES QuestionIMGs(QuestionIMGID),
    FOREIGN KEY (AnswerID) REFERENCES Answers(AnswerID)
)`)

//create QuestionCategories table if it doesnt yet exist
pool.query(`
CREATE TABLE IF NOT EXISTS QuestionCategories(
    QuestionID INTEGER NOT NULL,
    CategoryID INTEGER NOT NULL,

    PRIMARY KEY(QuestionID, CategoryID),
    
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
)`)