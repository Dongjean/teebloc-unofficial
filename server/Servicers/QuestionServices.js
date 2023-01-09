const pool = require('../DB.js');
const fs = require('fs');

async function Churn(Categories) {
    try {
        const result = await pool.query(`
        SELECT DISTINCT QuestionID, SchoolName, Email
        FROM Questions
        WHERE
            TopicID=ANY($1::int[]) AND
            PaperID=ANY($2::int[]) AND
            LevelID=ANY($3::int[]) AND
            AssessmentID=ANY($4::int[])
        `, [Categories.Topics, Categories.Papers, Categories.Levels, Categories.Assessments]) //Get all Questions for the Categories queried
        const Questions = result.rows

        for (var i=0; i<Questions.length; i++) {
            const Question = Questions[i]

            //get all Question Images related to this Question from DB
            const QNresult = await pool.query(`
            SELECT QuestionIMGID, QuestionIMGName, QuestionIMGDIR, QuestionID
            FROM QuestionIMGs
            WHERE QuestionID=$1
            `, [Question.questionid])

            //get Image Data from the Image Directory for all Images for this Question
            var QuestionImages = [];
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
            `, [Question.questionid])

            //get Image Data from the Image Directory for all Images for this Question
            var AnswerImages = [];
            for (var j=0; j<ANSresult.rows.length; j++) {
                const ANSIMGData = (await fs.promises.readFile(ANSresult.rows[j].answerimgdir)).toString('base64')
                AnswerImages.push({
                    AnswerIMGID: ANSresult.rows[j].answerimgid,
                    AnswerIMGName: ANSresult.rows[j].answerimgname,
                    AnswerIMGData: ANSIMGData,
                    QuestionID: ANSresult.rows[j].questionid
                })
            }
        }

        const Data = {
            Questions: Questions,
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

        //for now have no schoolname
        //Save Data in Questions table and get the new unique QuestionID
        const result = await pool.query(`
        INSERT INTO Questions(TopicID, PaperID, LevelID, AssessmentID, Email)
        VALUES($1, $2, $3, $4, $5)
        RETURNING QuestionID
        `, [FormData.TopicID, FormData.PaperID, FormData.LevelID, FormData.AssessmentID, FormData.Email])

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
    IMGDIRs = []
    for (var i=0; i<Images.length; i++) {
        const filenames = await fs.promises.readdir('./Images/' + ImageType) //read all file names in the QN or ANS Images directory
        var NewFilename = 1;
        const Imageextension = Images[i].name.split('.').slice(-1)[0] //get the extension

        filenames.forEach(function(filename) { //iterate through these file names to get a unqiue file name
            //file names in Images directory are all integer.extension
            const filenamedata = filename.split('.')
            if (Imageextension == filenamedata[1]) {
                NewFilename = parseInt(filenamedata[0]) + 1
            }
        })
        
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

module.exports = {Churn, PostQuestion};