const express = require('express');
const router = express.Router();

const {GetAll} = require('../../Servicers/CategoryServices.js');

router.get('/Categories/GetAll', (req, res) => {
    GetAll().then(response => res.json(response))
})

module.exports = router;