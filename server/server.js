const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001

const AccountRoutes = require('./Controllers/Routes/AccountRoutes.js');

app.use(AccountRoutes)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))