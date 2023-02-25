const express = require("express");
const cors = require("cors");//to delete in production
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'})); //to delete in production
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const dotenv = require("dotenv");
dotenv.config({path: path.resolve(__dirname, '.env')});

const PORT = process.env.PORT || 3001

const AccountRoutes = require('./Controllers/Routes/AccountRoutes.js');
const CategoryRoutes = require("./Controllers/Routes/CategoryRoutes.js");
const QuestionRoutes = require('./Controllers/Routes/QuestionRoutes.js');

app.use(AccountRoutes)
app.use(CategoryRoutes)
app.use(QuestionRoutes)

if (process.env.Node_Env == 'Production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })
}

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))