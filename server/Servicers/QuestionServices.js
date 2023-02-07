const pool = require('../DB.js');
const fs = require('fs');

async function Churn(Categories) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Users.Email = Questions.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID

        WHERE
            Questions.TopicID=ANY($1::int[]) AND
            Questions.PaperID=ANY($2::int[]) AND
            Questions.LevelID=ANY($3::int[]) AND
            Questions.AssessmentID=ANY($4::int[]) AND
            Questions.SchoolID=ANY($5::int[])
        `, [Categories.Topics, Categories.Papers, Categories.Levels, Categories.Assessments, Categories.Schools]) //Get all Questions for the Categories queried
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

             //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        return Data
    } catch(err) {
        console.log(err)
    }
}

async function GetQuestionsByID(QuestionID) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName, Users.Email,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Questions.Email = Users.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID

        WHERE
            Questions.QuestionID=$1
        `, [QuestionID]) //Get all Questions for the Categories queried
        const Question = result.rows[0]
        console.log(Question)

        var QuestionImages = [];
        var AnswerImages = [];

        //get all Question Images related to this Question from DB
        const QNresult = await pool.query(`
        SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
        FROM QuestionIMGs
        WHERE QuestionID=$1
        `, [QuestionID])

        //get Image Data from the Image Directory for all Images for this Question
        for (var j=0; j<QNresult.rows.length; j++) {
            const QNIMGData = (await fs.promises.readFile(QNresult.rows[j].questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.rows[j].questionimgid,
                QuestionIMGName: QNresult.rows[j].questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.rows[j].questionid
            })
        }

        //get all Answer Images related to this Question from DB
        const ANSresult = await pool.query(`
        SELECT AnswerIMGID, AnswerIMGName, AnswerIMGDIR, QuestionID
        FROM AnswerIMGs
        WHERE QuestionID=$1
        `, [QuestionID])

        //get Image Data from the Image Directory for all Images for this Question
        for (var j=0; j<ANSresult.rows.length; j++) {
            const ANSIMGData = (await fs.promises.readFile(ANSresult.rows[j].answerimgdir)).toString('base64')
            AnswerImages.push({
                AnswerIMGID: ANSresult.rows[j].answerimgid,
                AnswerIMGName: ANSresult.rows[j].answerimgname,
                AnswerIMGData: ANSIMGData,
                QuestionID: ANSresult.rows[j].questionid
            })
        }

        const Data = {
            Question: Question,
            QuestionImages: QuestionImages,
            AnswerImages: AnswerImages
        }
        return Data
    } catch(err) {
        console.log(err)
    }
}

async function PostQuestion(FormData) {
    try {
        //get Data about Images
        const QNImages = JSON.parse(FormData.QNImages)
        const ANSImages = JSON.parse(FormData.ANSImages)

        //Save Images
        const QNIMGDIRs = await SaveImages(QNImages, 'QN')
        const ANSIMGDIRs = await SaveImages(ANSImages, 'ANS')
        
        //Save Data in DB

        //Save Data in Questions table and get the new unique QuestionID
        const result = await pool.query(`
        INSERT INTO Questions(TopicID, PaperID, LevelID, AssessmentID, SchoolID, Email)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING QuestionID
        `, [FormData.TopicID, FormData.PaperID, FormData.LevelID, FormData.AssessmentID, FormData.SchoolID, FormData.Email])

        const QuestionID = result.rows[0].questionid

        //Save QNImages in DB
        for (var i=0; i<QNImages.length; i++) {
            const QNImage = QNImages[i]

            await pool.query(`
            INSERT INTO QuestionIMGs(QuestionIMGName, QuestionIMGDIR, QuestionID)
            VALUES($1, $2, $3)
            `, [QNImage.name, QNIMGDIRs[i], QuestionID])
        }

        //Save ANSImages in DB
        for (var i=0; i<ANSImages.length; i++) {
            const ANSImage = ANSImages[i]

            await pool.query(`
            INSERT INTO AnswerIMGs(AnswerIMGName, AnswerIMGDIR, QuestionID)
            VALUES($1, $2, $3)
            `, [ANSImage.name, ANSIMGDIRs[i], QuestionID])
        }

    } catch(err) {
        console.log(err)
    }
}

//helper function to save all the images
async function SaveImages(Images, ImageType) {
    var IMGDIRs = []
    for (var i=0; i<Images.length; i++) {
        const filenames = await fs.promises.readdir('./Images/' + ImageType) //read all file names in the QN or ANS Images directory
        const Imageextension = Images[i].name.split('.').slice(-1)[0].toLowerCase() //get the extension in lowercase since when files are saved the extensions become lowercase
        
        //gets an array of all filenames in the folder with the same extension as the uploaded file
        const sameEXTfilenames = filenames.map(filename => {
            const filenamedata = filename.split('.')
            if (Imageextension == filenamedata[1]) {
                return parseInt(filenamedata[0])
            }
        }).filter(filename => filename)

        //get the largest number and adds one to it to get a unique filename
        var NewFilename;
        if (sameEXTfilenames.length == 0) {
            NewFilename = 1
        } else {
            NewFilename = Math.max(...sameEXTfilenames) + 1
        }
        console.log(NewFilename)
        
        //NewFilename + extension is a unique filename

        //save this QNImage file as a unique file in the /Images/QN directory
        const data = Images[i].IMGData.split(',')[1]
        let buffer = Buffer.from(data, 'base64')

        const IMGDIR = './Images/' + ImageType + '/' + NewFilename + '.' + Imageextension
        fs.writeFileSync(IMGDIR, buffer);
        IMGDIRs.push(IMGDIR)
    }

    return IMGDIRs //returns the array of image directories to be saved in the database
}

async function SaveQuestion(QuestionID, Email) {
    try {
        await pool.query(`
        INSERT INTO SavedQuestions VALUES($1, $2)
        `, [QuestionID, Email])
    } catch(err) {
        console.log(err)
    }
}

async function unSaveQuestion(QuestionID, Email) {
    try {
        await pool.query(`
        DELETE FROM SavedQuestions WHERE QuestionID=$1 AND Email=$2
        `, [QuestionID, Email])
    } catch(err) {
        console.log(err)
    }
}

async function CheckSavedQuestion(QuestionID, Email) {
    try {
        const result = await pool.query(`
        SELECT * FROM SavedQuestions WHERE QuestionID=$1 AND Email=$2
        `, [QuestionID, Email])
        return result.rows.length !== 0
    } catch(err) {
        console.log(err)
    }
}

async function GetSavedQuestions(Email) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Questions.Email = Users.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID
        
        JOIN SavedQuestions
            ON SavedQuestions.QuestionID = Questions.QuestionID
            
        WHERE SavedQuestions.Email = $1
        `, [Email])
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

            //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]
            console.log(QNresult.rows)

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        
        return Data
    } catch(err) {
        console.log(err)
    }
}

async function DeleteQuestion(QuestionID) {
    try {
        //get the directories of the question image files to delete
        const QuestionIMGs = (await pool.query(`
        SELECT QuestionIMGDIR FROM QuestionIMGs WHERE QuestionID=$1
        `, [QuestionID])).rows

        //get the directories of the answer image files to delete
        const AnswerIMGs = (await pool.query(`
        SELECT AnswerIMGDIR FROM AnswerIMGs WHERE QuestionID=$1
        `, [QuestionID])).rows

        console.log(QuestionIMGs, AnswerIMGs)
        for (var i=0; i<QuestionIMGs.length; i++) {
            fs.promises.unlink(QuestionIMGs[i].questionimgdir)
        }

        for (var i=0; i<AnswerIMGs.length; i++) {
            fs.promises.unlink(AnswerIMGs[i].answerimgdir)
        }

        await pool.query(`
        DELETE FROM QuestionIMGs WHERE QuestionID=$1
        `, [QuestionID])
        await pool.query(`
        DELETE FROM AnswerIMGs WHERE QuestionID=$1
        `, [QuestionID])
        await pool.query(`
        DELETE FROM SavedQuestions WHERE QuestionID=$1
        `, [QuestionID])
        await pool.query(`
        DELETE FROM CompletedQuestions WHERE QuestionID=$1
        `, [QuestionID])
        await pool.query(`
        DELETE FROM Questions WHERE QuestionID=$1
        `, [QuestionID])
    } catch(err) {
        console.log(err)
    }
}

async function GetQuestionsByAuthor(Email) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Questions.Email = Users.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID

        WHERE
            Users.Email=$1
        `, [Email]) //Get all Questions for the Categories queried
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

            //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        return Data

    } catch(err) {
        console.log(err)
    }
}

async function CompleteQuestion(QuestionID, Email) {
    try {
        await pool.query(`
        INSERT INTO CompletedQuestions VALUES($1, $2)
        `, [QuestionID, Email])
    } catch(err) {
        console.log(err)
    }
}

async function UncompleteQuestion(QuestionID, Email) {
    try {
        await pool.query(`
        DELETE FROM CompletedQuestions WHERE QuestionID=$1 AND Email=$2
        `, [QuestionID, Email])
    } catch(err) {
        console.log(err)
    }
}

async function CheckCompletedQuestion(QuestionID, Email) {
    try {
        const result = await pool.query(`
        SELECT * FROM CompletedQuestions WHERE QuestionID=$1 AND Email=$2
        `, [QuestionID, Email])
        return result.rows.length !== 0
    } catch(err) {
        console.log(err)
    }
}

async function GetCompletedQuestions(Email) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Questions.Email = Users.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID
        
        JOIN CompletedQuestions
            ON CompletedQuestions.QuestionID = Questions.QuestionID
            
        WHERE CompletedQuestions.Email = $1
        `, [Email])
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

            //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]
            console.log(QNresult.rows)

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        
        return Data
    } catch(err) {
        console.log(err)
    }
}

async function Get_Saved_Questions_Filtered(Email, Categories) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Users.Email = Questions.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID

        JOIN SavedQuestions
            ON SavedQuestions.QuestionID = Questions.QuestionID

        WHERE
            Questions.TopicID=ANY($1::int[]) AND
            Questions.PaperID=ANY($2::int[]) AND
            Questions.LevelID=ANY($3::int[]) AND
            Questions.AssessmentID=ANY($4::int[]) AND
            Questions.SchoolID=ANY($5::int[]) AND
            
            SavedQuestions.Email=$6
        `, [Categories.Topics, Categories.Papers, Categories.Levels, Categories.Assessments, Categories.Schools, Email]) //Get all Questions for the Categories queried
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

             //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        return Data
    } catch(err) {
        console.log(err)
    }

}

async function Get_Completed_Questions_Filtered(Email, Categories) {
    try {
        const result = await pool.query(`
        SELECT
            Questions.QuestionID,
            Users.FirstName, Users.LastName,
            Topics.TopicID, Topics.TopicName,
            Papers.PaperID, Papers.Paper,
            Levels.LevelID, Levels.Level,
            Assessments.AssessmentID, Assessments.AssessmentName,
            Schools.SchoolID, Schools.SchoolName

        FROM Questions JOIN Users
            ON Users.Email = Questions.Email
        JOIN Topics
            ON Topics.TopicID = Questions.TopicID
        JOIN Papers
            ON Papers.PaperID = Questions.PaperID
        JOIN Levels
            ON Levels.LevelID = Questions.LevelID
        JOIN Assessments
            ON Assessments.AssessmentID = Questions.AssessmentID
        JOIN Schools
            ON Schools.SchoolID = Questions.SchoolID

        JOIN CompletedQuestions
            ON CompletedQuestions.QuestionID = Questions.QuestionID

        WHERE
            Questions.TopicID=ANY($1::int[]) AND
            Questions.PaperID=ANY($2::int[]) AND
            Questions.LevelID=ANY($3::int[]) AND
            Questions.AssessmentID=ANY($4::int[]) AND
            Questions.SchoolID=ANY($5::int[]) AND
            
            CompletedQuestions.Email=$6
        `, [Categories.Topics, Categories.Papers, Categories.Levels, Categories.Assessments, Categories.Schools, Email]) //Get all Questions for the Categories queried
        const Questions = result.rows
        console.log(Questions)

        var QuestionImages = [];
        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

             //get the first Question Image only related to this Question from DB
            const QNresult = (await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            LIMIT 1
            `, [Question.questionid])).rows[0]

            //get Image Data from the Image Directory for the first Image for this Question
            const QNIMGData = (await fs.promises.readFile(QNresult.questionimgdir)).toString('base64')
            QuestionImages.push({
                QuestionIMGID: QNresult.questionimgid,
                QuestionIMGName: QNresult.questionimgname,
                QuestionIMGData: QNIMGData,
                QuestionID: QNresult.questionid
            })
        }

        const Data = {
            Questions: Questions,
            QuestionImages: QuestionImages
        }
        return Data
    } catch(err) {
        console.log(err)
    }
}

module.exports = {Churn, GetQuestionsByID, PostQuestion, SaveQuestion, unSaveQuestion, CheckSavedQuestion, GetSavedQuestions, DeleteQuestion, GetQuestionsByAuthor, CompleteQuestion, UncompleteQuestion, CheckCompletedQuestion, GetCompletedQuestions, Get_Saved_Questions_Filtered, Get_Completed_Questions_Filtered};