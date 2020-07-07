const express = require("express");
const db = require("../data/db");
const { response } = require("express");
const { findPostComments } = require("../data/db");

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
            res.status(201).send(postID);
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
    let deletedPosts = [];

    db.findById(id)
        .then(posts => {
            if (posts.length) {
                deletedPosts = posts;
                return db.remove(id);
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                });
            }
        })
        .then(count => {
            if (count) {
                res.status(200).json(deletedPosts);
            } else {
                res.status(500).json({
                    error: "Could not delete the post"
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "Could not delete the post"
            });
        });
});


// Edit

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const dataToModify = {
        title: req.body.title,
        contents: req.body.contents
    };

    if (!dataToModify.title || !dataToModify.contents) {
        res.status(400).json({
            error: "Please provide title and contents."
        });
    }

    db.update(id, dataToModify)
        .then(count => {
            if (count) {
                return db.findById(id);
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                });
            }
        })
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
                error: "Server error. Could not update the post."
            });
        })

});


// Post a comment

router.post("/:id/comments", (req, res) => {
    const comment = {
        post_id: req.params.id,
        text: req.body.text
    };

    if (!comment.text) {
        res.status(400).json({
            error: "Please provide text."
        });
    }

    db.findById(comment.post_id)
        .then(posts => {
            if (posts.length) {
                return db.insertComment(comment);
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist."
                });
            }
        })
        .then(result => {
            return db.findCommentById(result.id);
        })
        .then(savedComment => {
            return res.status(201).json(savedComment);
        })
        .catch(error => {
            res.status(500).json({
                error: "There was an error while saving the comment to the database"
            });
        });
});


// Get all comments of a post

router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;

    db.findPostComments(postId)
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(error => {
            res.status(500).json({
                error: "There was an error while saving the comment to the database"
            });
        });
});


module.exports = router;