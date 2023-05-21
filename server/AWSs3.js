const AWS = require('aws-sdk');

const dotenv = require("dotenv");
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyID,
    secretAccessKey: process.env.AWSSecretAccessKey
});

module.exports = s3;