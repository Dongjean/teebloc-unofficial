const pool = require("../DB");

async function GetAll() {
    try {
        const result = await pool.query(`SELECT * FROM Categories ORDER BY Category ASC`) //get all categories ordered in alphabetical order
        return result.rows
    } catch(err) {
        console.log(err)
    }
}

module.exports = {GetAll};