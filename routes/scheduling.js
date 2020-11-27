const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");
const { parse } = require("path");

const path = require("path");
const { start } = require("repl");

const { TaskList } = require("../models/Task");
const User = require("../models/User");


// SECTION - FETCH SCHEDULING INTERVAL
// Fetch scheduling interval
router.get("/:userid", async (req, res) => {
    let userid = req.params.userid;
    let errors = [];
    let schedulingInterval = [];

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
                schedulingInterval = user.allowSchedulingInterval;
            } else {
                errors.push("no user found for given user id");
            }
        })
        .catch((err) => console.error(err));

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.status(200).send(schedulingInterval);
    }
});
// !SECTION

// SECTION - UPDATE DNS
// Update a DNS
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

    let {updateInfo} = req.body
    let action = {
        $set: {"allowSchedulingInterval": updateInfo}
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
    res.status(201).send(updateInfo);
});
// !SECTION

// SECTION - GENERATE SCHEDULE
// Generate schedule
router.get("/generateSchedule/:userid", async (req, res) => {
    let userid = req.params.userid;
    let errors = [];
    let user;

    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    await User.findById(userid)
        .then((res) => {
            if (res) {
                user = res;
            } else {
                errors.push("no user found for given user id");
            }
        })
        .catch((err) => console.error(err));


    let start = user.allowSchedulingInterval.startTime.substring(11, 16)
    let end = user.allowSchedulingInterval.endTime.substring(11, 16)
    let startConversion = parseInt(start.substring(0,2)) - 5
    let endConversion = parseInt(end.substring(0,2)) - 5
    if (startConversion < 0) {
        startConversion = 24 + startConversion
    }
    if (endConversion < 0) {
        endConversion = 24 + endConversion
    }
    start = String(startConversion) + start.substring(2, 5)
    end = String(endConversion) + end.substring(2, 5)

    let doTodays = []
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i].doToday) {
            doTodays.push(user.habits[i])
        }
    }

    for (let i = 0; i < user.tasks.length; i++) {
        if (user.tasks[i].doToday) {
            doTodays.push(user.tasks[i])
        }
    }

    doTodays.sort((a, b) => (a.priority < b.priority) ? 1 : -1)
    
    let scheduledUpToHours = parseInt(start.substring(0,2))
    let scheduledUpToMinutes = parseInt(start.substring(3,5))

    let endHours = parseInt(end.substring(0,2))
    let endMinutes = parseInt(end.substring(3, 5))

    console.log(scheduledUpToHours, scheduledUpToMinutes, endhours, endMinutes)
    let iter = 0
    while (true) {
        if (iter >= doTodays.length) {
            break
        } 
        // LEFT OFF HERE

        // if (doTodays[iter].timeEstimate + scheduledUpToHours >= endHours) {
        //     if (scheduledUpToMinutes >= endMinutes) {
        //         break
        //     }
        // }
        iter += 1
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.status(200).send(user);
    }
});
// !SECTION

module.exports = router;
