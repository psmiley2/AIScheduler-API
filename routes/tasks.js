const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");

const path = require("path");

const { TaskList } = require("../models/Task");
const User = require("../models/User");



// SECTION - CREATE TASK
// Create a new task
router.post("/:userid", async (req, res) => {
    let { userid } = req.params;
    let errors = [];
    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let task = {
        _id: new ObjectID(),
        title: req.body.title,
        completed: false,
        created: new Date(),
        priority: req.body.priority,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        timeEstimate: req.body.timeEstimate
    };

    let action = {
        $push: { "tasks": task },
    };

    await User.findByIdAndUpdate(userid, action)
        .then((res) => {
            if (!res) {
                errors.push("no user was found with the given userid");
            }
        })
        .catch((err) => {
            console.error(err);
        });

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    // No errors
    res.status(201).send(task);
});
// !SECTION


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


// SECTION - UPDATE TASK
// Update a task
router.post("/:userid/:taskid", async (req, res) => {
    let { userid, taskid } = req.params; 
    let errors = [];
    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let {taskInfo} = req.body
    let action = {
        $set: {"tasks.$[task]": taskInfo}
    }

    let filter = {
        arrayFilters: [{"task._id": taskid}]
    }

    await User.findByIdAndUpdate(userid, action, filter)
        .then((res) => {
            if (!res) {
                errors.push("no user was found with the given userid");
            }
        })
        .catch((err) => {
            console.error(err);
        });

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    // No errors
    res.status(201).send(taskInfo);
});
// !SECTION

// SECTION - DELETE TASK
// Delete a task
router.delete("/:userid/:taskid", async (req, res) => {
    let { userid, taskid } = req.params; 
    let errors = [];
    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let action = {
        $pull: {"tasks": {"_id": taskid}}
    }

    await User.findByIdAndUpdate(userid, action)
        .then((res) => {
            if (!res) {
                errors.push("no user was found with the given userid");
            }
        })
        .catch((err) => {
            console.error(err);
        });

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    // No errors
    res.status(201).send(taskid);
});
// !SECTION

module.exports = router;
