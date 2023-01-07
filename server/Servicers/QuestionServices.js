const pool = require('../DB.js');
const fs = require('fs');

async function Churn(Categories) {
    try {
        const CatIDs = Categories.map(Category => Category.categoryid) //Gets an array of CategoryIDs from Cats
        const result = await pool.query(`
        SELECT DISTINCT Z.QuestionID, Z.Question, Z.QuestionIMGID, Z.AnswerID, W.Answer, W.AnswerIMGID
        FROM
            (SELECT X.QuestionID, X.Question, X.QuestionIMGID, X.AnswerID, Y.CategoryID
            FROM Questions X JOIN QuestionCategories Y
            ON X.QuestionID=Y.QuestionID) Z
        JOIN Answers W
        ON Z.AnswerID=W.AnswerID
        WHERE Z.CategoryID=ANY($1::int[])`, [CatIDs]) //Get all Questions for the Categories in CatIDs
        
        return result.rows
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