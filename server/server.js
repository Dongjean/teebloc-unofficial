const express = require("express");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'secret123', saveUninitialized: true, resave: false}))

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001

const AccountRoutes = require('./Controllers/Routes/AccountRoutes.js');
const CategoryRoutes = require("./Controllers/Routes/CategoryRoutes.js");
const QuestionRoutes = require('./Controllers/Routes/QuestionRoutes.js');

app.use(AccountRoutes)
app.use(CategoryRoutes)
app.use(QuestionRoutes)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))