const pool = require('../DB.js');

async function Churn(Cats) {
    try {
        CatIDs = Cats.map(Cat => Cat.categoryid) //Gets an array of CategoryIDs from Cats
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

module.exports = {Churn};