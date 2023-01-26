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

async function GetSchools(Subject) {
    try {
        const result = await pool.query(`
        SELECT Schools.SchoolID, Schools.SchoolName
        FROM Schools JOIN School_Subject
        ON Schools.SchoolID = School_Subject.SchoolID
        WHERE School_Subject.SubjectID = $1
        `, [Subject])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function AddNewSubject(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Subjects(Subject) VALUES($1)
        RETURNING SubjectID
        `, [Data.NewSubject])

        const NewSubjectID = result.rows[0].subjectid

        console.log(Data)

        if (Data.Levels.length !== 0) {
            for (var i=0; i<Data.Levels.length; i++) {
                await pool.query(`
                INSERT INTO Subject_Level VALUES($1, $2)
                `, [NewSubjectID, Data.Levels[i]])
            }
        }

        if (Data.Papers.length !== 0) {
            for (var i=0; i<Data.Papers.length; i++) {
                await pool.query(`
                INSERT INTO Subject_Paper VALUES($1, $2)
                `, [NewSubjectID, Data.Papers[i]])
            }
        }

        if (Data.Schools.length !== 0) {
            for (var i=0; i<Data.Schools.length; i++) {
                await pool.query(`
                INSERT INTO School_Subject VALUES($1, $2)
                `, [Data.Schools[i], NewSubjectID])
            }
        }

    } catch(err) {
        console.log(err)
    }
}

async function AddNewTopic(Data) {
    try {
        await pool.query(`
        INSERT INTO Topics(TopicName, SubjectID) VALUES($1, $2)
        `, [Data.NewTopic, Data.Subject])

    } catch(err) {
        console.log(err)
    }
}

async function AddNewLevel(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Levels(Level) VALUES($1)
        RETURNING LevelID
        `, [Data.NewLevel])

        const NewLevelID = result.rows[0].levelid

        console.log(Data)

        if (Data.Subjects.length !== 0) {
            for (var i=0; i<Data.Subjects.length; i++) {
                console.log(Data.Subjects[i])
                await pool.query(`
                INSERT INTO Subject_Level VALUES($1, $2)
                `, [Data.Subjects[i], NewLevelID])
                console.log('hi')
            }
        }

        if (Data.Assessments.length !== 0) {
            for (var i=0; i<Data.Assessments.length; i++) {
                await pool.query(`
                INSERT INTO Assessment_Level VALUES($1, $2)
                `, [NewLevelID, Data.Assessments[i]])
            }
        }

    } catch(err) {
        console.log(err)
    }
}

async function AddNewAssessment(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Assessments(AssessmentName) VALUES($1)
        RETURNING AssessmentID
        `, [Data.NewAssessment])

        const NewAssessmentID = result.rows[0].assessmentid

        console.log(Data)

        if (Data.Levels.length !== 0) {
            for (var i=0; i<Data.Levels.length; i++) {
                await pool.query(`
                INSERT INTO Assessment_Level VALUES($1, $2)
                `, [NewAssessmentID, Data.Levels[i]])
            }
        }

    } catch(err) {
        console.log(err)
    }
}

async function AddNewSchool(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Schools(SchoolName) VALUES($1)
        RETURNING SchoolID
        `, [Data.NewSchool])

        const NewSchoolID = result.rows[0].schoolid

        console.log(Data)

        if (Data.Subjects.length !== 0) {
            for (var i=0; i<Data.Subjects.length; i++) {
                await pool.query(`
                INSERT INTO School_Subject VALUES($1, $2)
                `, [NewSchoolID, Data.Subjects[i]])
            }
        }

    } catch(err) {
        console.log(err)
    }
}

async function GetAllLevels() {
    try {
        const result = await pool.query(`
        SELECT * FROM Levels
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetAllPapers() {
    try {
        const result = await pool.query(`
        SELECT * FROM Papers
        `)
        return result.rows
    } catch(err) {
        console.log(err) 
    }
}

async function GetAllSchools() {
    try {
        const result = await pool.query(`
        SELECT * FROM Schools
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function GetAllAssessments() {
    try {
        const result = await pool.query(`
        SELECT * FROM Assessments
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

module.exports = {GetAllSubjects, GetLevels, GetAssessments, GetAssessmentsFromLevels, GetTopics, GetPapers, GetSchools, AddNewSubject, AddNewTopic, AddNewLevel, AddNewAssessment, AddNewSchool, GetAllLevels, GetAllPapers, GetAllSchools, GetAllAssessments};