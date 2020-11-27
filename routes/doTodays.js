const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");

const path = require("path");

const { TaskList } = require("../models/Task");
const User = require("../models/User");




// SECTION - FETCH ALL TASKS
// Fetch all tasks
router.get("/:userid", async (req, res) => {
    let userid = req.params.userid;
    let errors = [];
    let tasks = [];

    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    await User.findById(userid)
        .then((user) => {
            if (user) {
                tasks = user.tasks;
            } else {
                errors.push("no user found for given user id");
            }
        })
        .catch((err) => console.error(err));

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.status(200).send(tasks);
    }
});
// !SECTION

module.exports = router;
