const express = require("express");
const db = require("../data/db");
const { response } = require("express");

const router = express.Router();


// Get all posts

router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({
                error: "The posts information could not be retrieved"
            });
        });
});


// Get a post by id

router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(posts => {
            if (posts.length) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "The post information could not be retrieved"
            });
        });
});


// Add a post

router.post("/", (req, res) => {
    const newPost = {
        title: req.body.title,
        contents: req.body.contents
    };

    if (!newPost.title || !newPost.contents) {
        res.status(400).json({
            error: "Please provide title and contents for the post."
        })
    }
    
    db.insert(newPost)
        .then(postID => {
            res.status(201).json(postID);
        })
        .catch(error => {
            res.status(500).json({
                error: "Please provide title and contents for the post"
            });
        });
});


// Delete a post

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(count => {
            if (count) {
                res.status(200).json(count);
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not delete the post."
            });
        });
});


module.exports = router;