const pool = require("../DB");

//Conditional Get

async function Get_Levels_fromSubjectID(SubjectID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT LevelID, Level
            FROM Levels
            WHERE NOT LevelID IN (
                SELECT LevelID FROM Subject_Level WHERE SubjectID=$1
            )
            `, [SubjectID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Levels.LevelID, Levels.Level
            FROM Levels JOIN Subject_Level
            ON Levels.LevelID = Subject_Level.LevelID
            WHERE Subject_Level.SubjectID = $1
            `, [SubjectID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Levels_fromAssessmentID(AssessmentID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT LevelID, Level
            FROM Levels
            WHERE NOT LevelID IN (
                SELECT LevelID FROM Assessment_Level WHERE AssessmentID=$1
            )
            `, [AssessmentID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Levels.LevelID, Levels.Level
            FROM Levels JOIN Assessment_Level
            ON Levels.LevelID = Assessment_Level.LevelID
            WHERE Assessment_Level.AssessmentID = $1
            `, [AssessmentID])
            
            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Assessments_fromLevelID(LevelID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT AssessmentID, AssessmentName
            FROM Assessments
            WHERE NOT AssessmentID IN (
                SELECT AssessmentID FROM Assessment_Level WHERE LevelID=$1
            )
            `, [LevelID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Assessments.AssessmentID, Assessments.AssessmentName
            FROM Assessments JOIN Assessment_Level
            ON Assessments.AssessmentID = Assessment_Level.AssessmentID
            WHERE Assessment_Level.LevelID = $1
            `, [LevelID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Assessments_fromLevelIDs(LevelIDs) {
    try {
        const result = await pool.query(`
        SELECT DISTINCT Assessments.AssessmentID, Assessments.AssessmentName
        FROM Assessments JOIN Assessment_Level
        ON Assessments.AssessmentID = Assessment_Level.AssessmentID
        WHERE Assessment_Level.LevelID = ANY($1::int[])
        `, [LevelIDs])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function Get_Topics_fromSubjectID(SubjectID) {
    try {
        const result = await pool.query(`
        SELECT TopicID, TopicName
        FROM Topics
        WHERE SubjectID = $1
        `, [SubjectID])
        return result.rows
    } catch(err) {

    }
}

async function Get_Papers_fromSubjectID(SubjectID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT PaperID, Paper
            FROM Papers
            WHERE NOT PaperID IN (
                SELECT PaperID FROM Subject_Paper WHERE SubjectID=$1
            )
            `, [SubjectID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Papers.PaperID, Papers.Paper
            FROM Papers JOIN Subject_Paper
            ON Papers.PaperID = Subject_Paper.PaperID
            WHERE Subject_Paper.SubjectID = $1
            `, [SubjectID])
            
            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Schools_fromSubjectID(SubjectID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT SchoolID, SchoolName
            FROM Schools
            WHERE NOT SchoolID IN (
                SELECT SchoolID FROM School_Subject WHERE SubjectID=$1
            )
            `, [SubjectID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Schools.SchoolID, Schools.SchoolName
            FROM Schools JOIN School_Subject
            ON Schools.SchoolID = School_Subject.SchoolID
            WHERE School_Subject.SubjectID = $1
            `, [SubjectID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Subjects_fromLevelID(LevelID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT SubjectID, Subject
            FROM Subjects
            WHERE NOT SubjectID IN (
                SELECT SubjectID FROM Subject_Level WHERE LevelID=$1
            )
            `, [LevelID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Subjects.SubjectID, Subjects.Subject
            FROM Subjects JOIN Subject_Level
            ON Subjects.SubjectID = Subject_Level.SubjectID
            WHERE Subject_Level.LevelID=$1
            `, [LevelID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Subjects_fromPaperID(PaperID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT SubjectID, Subject
            FROM Subjects
            WHERE NOT SubjectID IN (
                SELECT SubjectID FROM Subject_Paper WHERE PaperID=$1
            )
            `, [PaperID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Subjects.SubjectID, Subjects.Subject
            FROM Subjects JOIN Subject_Paper
            ON Subjects.SubjectID = Subject_Paper.SubjectID
            WHERE Subject_Paper.PaperID=$1
            `, [PaperID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Subjects_fromSchoolID(SchoolID, Options) {
    try {
        if (Options == 'Inverse') {
            const result = await pool.query(`
            SELECT SubjectID, Subject
            FROM Subjects
            WHERE NOT SubjectID IN (
                SELECT SubjectID FROM School_Subject WHERE SchoolID=$1
            )
            `, [SchoolID])

            return result.rows
        } else {
            const result = await pool.query(`
            SELECT Subjects.SubjectID, Subjects.Subject
            FROM Subjects JOIN School_Subject
            ON Subjects.SubjectID = School_Subject.SubjectID
            WHERE School_Subject.SchoolID=$1
            `, [SchoolID])

            return result.rows
        }
    } catch(err) {
        console.log(err)
    }
}

async function Get_Subjects_fromTopicID(TopicID) {
    try {
        const result = await pool.query(`
        SELECT Subjects.Subject, Subjects.SubjectID
        FROM Subjects JOIN Topics
        ON Subjects.SubjectID = Topics.SubjectID
        WHERE Topics.TopicID=$1
        `, [TopicID])
        return result.rows
    } catch(err) {
        console.log(err)
    }
}


//GetAll

async function Get_Subjects_All() {
    try {
        const result = await pool.query(`SELECT * FROM Subjects ORDER BY Subject ASC`) //get all categories ordered in alphabetical order
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function Get_Topics_All() {
    try {
        const result = await pool.query(`
        SELECT * FROM Topics
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function Get_Levels_All() {
    try {
        const result = await pool.query(`
        SELECT * FROM Levels
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function Get_Papers_All() {
    try {
        const result = await pool.query(`
        SELECT * FROM Papers
        `)
        return result.rows
    } catch(err) {
        console.log(err) 
    }
}

async function Get_Schools_All() {
    try {
        const result = await pool.query(`
        SELECT * FROM Schools
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

async function Get_Assessments_All() {
    try {
        const result = await pool.query(`
        SELECT * FROM Assessments
        `)
        return result.rows
    } catch(err) {
        console.log(err)
    }
}


//Add New

async function AddNewSubject(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Subjects(Subject) VALUES($1)
        RETURNING SubjectID
        `, [Data.NewSubject])

        const NewSubjectID = result.rows[0].subjectid

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

        if (Data.Subjects.length !== 0) {
            for (var i=0; i<Data.Subjects.length; i++) {
                await pool.query(`
                INSERT INTO Subject_Level VALUES($1, $2)
                `, [Data.Subjects[i], NewLevelID])
            }
        }

        if (Data.Assessments.length !== 0) {
            for (var i=0; i<Data.Assessments.length; i++) {
                await pool.query(`
                INSERT INTO Assessment_Level VALUES($1, $2)
                `, [Data.Assessments[i], NewLevelID])
            }
        }

    } catch(err) {
        console.log(err)
    }
}

async function AddNewPaper(Data) {
    try {
        const result = await pool.query(`
        INSERT INTO Papers(Paper) VALUES($1)
        RETURNING PaperID
        `, [Data.NewPaper])

        const NewPaperID = result.rows[0].paperid

        if (Data.Subjects.length !== 0) {
            for (var i=0; i<Data.Subjects.length; i++) {
                await pool.query(`
                INSERT INTO Subject_Paper VALUES($1, $2)
                `, [Data.Subjects[i], NewPaperID])
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


//Unlink

async function Unlink_Subject_Level(SubjectID, LevelID) {
    try {
        await pool.query(`
        DELETE FROM Subject_Level WHERE SubjectID=$1 AND LevelID=$2
        `, [SubjectID, LevelID])
    } catch(err) {
        console.log(err)
    }
}

async function Unlink_Subject_Paper(SubjectID, PaperID) {
    try {
        await pool.query(`
        DELETE FROM Subject_Paper WHERE SubjectID=$1 AND PaperID=$2
        `, [SubjectID, PaperID])
    } catch(err) {
        console.log(err)
    }
}

async function Unlink_School_Subject(SchoolID, SubjectID) {
    try {
        await pool.query(`
        DELETE FROM School_Subject WHERE SchoolID=$1 AND SubjectID=$2
        `, [SchoolID, SubjectID])
    } catch(err) {
        console.log(err)
    }
}

async function Unlink_Assessment_Level(AssessmentID, LevelID) {
    try {
        await pool.query(`
        DELETE FROM Assessment_Level WHERE AssessmentID=$1 AND LevelID=$2
        `, [AssessmentID, LevelID])
    } catch(err) {
        console.log(err)
    }
}


//Relink

async function Relink_Topic_Subject(TopicID, SubjectID) {
    try {
        await pool.query(`
        UPDATE Topics
        SET SubjectID=$1
        WHERE TopicID=$2
        `, [SubjectID, TopicID])
    } catch(err) {
        console.log(err)
    }
}


//Link

async function Link_Subject_Level(SubjectID, LevelID) {
    try {
        await pool.query(`
        INSERT INTO Subject_Level(SubjectID, LevelID) VALUES($1, $2)
        `, [SubjectID, LevelID])
    } catch(err) {
        console.log(err)
    }
}

async function Link_Subject_Paper(SubjectID, PaperID) {
    try {
        await pool.query(`
        INSERT INTO Subject_Paper(SubjectID, PaperID) VALUES($1, $2)
        `, [SubjectID, PaperID])
    } catch(err) {
        console.log(err)
    }
}

async function Link_School_Subject(SchoolID, SubjectID) {
    try {
        await pool.query(`
        INSERT INTO School_Subject(SchoolID, SubjectID) VALUES($1, $2)
        `, [SchoolID, SubjectID])
    } catch(err) {
        console.log(err)
    }
}

async function Link_Assessment_Level(AssessmentID, LevelID) {
    try {
        await pool.query(`
        INSERT INTO Assessment_Level(AssessmentID, LevelID) VALUES($1, $2)
        `, [AssessmentID, LevelID])
    } catch(err) {
        console.log(err)
    }
}


//Delete

async function Delete_Subject(SubjectID) {
    try {
        //Delete relations
        
        //Delete Levels Relations
        pool.query(`
        DELETE FROM Subject_Level WHERE SubjectID=$1
        `, [SubjectID])
        //Delete Papers Relations
        pool.query(`
        DELETE FROM Subject_Paper WHERE SubjectID=$1
        `, [SubjectID])
        //Delete Schools Relations
        pool.query(`
        DELETE FROM School_Subject WHERE SubjectID=$1
        `, [SubjectID])

        
        //Delete the Subject
        pool.query(`
        DELETE FROM Subjects WHERE SubjectID=$1
        `, [SubjectID])
    } catch(err) {
        console.log(err)
    }
}

async function Delete_Topic(TopicID) {
    try {
        //Delete the Topic
        pool.query(`
        DELETE FROM Topics WHERE TopicID=$1
        `, [TopicID])
    } catch(err) {
        console.log(err)
    }
}

async function Delete_Level(LevelID) {
    try {
        //Delete relations
        
        //Delete Subject Relations
        pool.query(`
        DELETE FROM Subject_Level WHERE LevelID=$1
        `, [LevelID])
        //Delete Assessment Relations
        pool.query(`
        DELETE FROM Assessment_Level WHERE LevelID=$1
        `, [LevelID])

        
        //Delete the Level
        pool.query(`
        DELETE FROM Levels WHERE LevelID=$1
        `, [LevelID])
    } catch(err) {
        console.log(err)
    }
}

async function Delete_Paper(PaperID) {
    try {
        //Delete relations
        
        //Delete Subject Relations
        pool.query(`
        DELETE FROM Subject_Paper WHERE PaperID=$1
        `, [PaperID])

        
        //Delete the Paper
        pool.query(`
        DELETE FROM Papers WHERE PaperID=$1
        `, [PaperID])
    } catch(err) {
        console.log(err)
    }
}

async function Delete_Assessment(AssessmentID) {
    try {
        //Delete relations
        
        //Delete Level Relations
        pool.query(`
        DELETE FROM Assessment_Level WHERE AssessmentID=$1
        `, [AssessmentID])

        
        //Delete the Assessment
        pool.query(`
        DELETE FROM Assessments WHERE AssessmentID=$1
        `, [AssessmentID])
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
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
    Delete_Assessment
};