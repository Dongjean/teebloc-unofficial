const pool = require("../DB");

async function GetAllSubjects() {
    try {
        const result = await pool.query(`SELECT * FROM Subjects ORDER BY Subject ASC`) //get all categories ordered in alphabetical order
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

module.exports = {GetAllSubjects};