const express = require("express");
const db = require("../data/db");
const { response } = require("express");

const router = express.Router();


router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


module.exports = router;