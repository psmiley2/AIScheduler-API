const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");

const path = require("path");

const { TaskList } = require("../models/Task");
const User = require("../models/User");


// SECTION - CREATE HABIT
// Create a new habit
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

    let habit = {
        _id: new ObjectID(),
        title: req.body.title,
        completed: false,
        created: new Date(),
        priority: req.body.priority,
        timesPerWeek: req.body.priority,
        weeklyCounter: 0,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        timeEstimate: req.body.timeEstimate
    };

    let action = {
        $push: { "habits": habit },
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
    res.status(201).send(habit);
});
// !SECTION


// SECTION - FETCH ALL HABITS
// Fetch all habits
router.get("/:userid", async (req, res) => {
    let userid = req.params.userid;
    let errors = [];
    let habits = [];

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
                habits = user.habits;
            } else {
                errors.push("no user found for given user id");
            }
        })
        .catch((err) => console.error(err));

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.status(200).send(habits);
    }
});
// !SECTION

// SECTION - UPDATE HABIT
// Update a habit
router.post("/:userid/:habitid", async (req, res) => {
    let { userid, habitid } = req.params; 
    let errors = [];
    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let {updateInfo} = req.body
    let action = {
        $set: {"habits.$[habit]": updateInfo}
    }

    let filter = {
        arrayFilters: [{"habit._id": habitid}]
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
    res.status(201).send(updateInfo);
});
// !SECTION

// SECTION - DELETE HABIT
// Delete a habit
router.delete("/:userid/:habitid", async (req, res) => {
    let { userid, habitid } = req.params; 
    let errors = [];
    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let action = {
        $pull: {"habits": {"_id": habitid}}
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
    res.status(201).send(habitid);
});
// !SECTION

module.exports = router;
