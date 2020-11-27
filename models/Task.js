const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    doToday: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        default: "task"
    },
    priority: {
        type: Number,
        default: 1
    },
    startTime: {
        type: String,
        default: "00:00"
    },
    endTime: {
        type: String,
        default: "23:59"
    },
    timeEstimate: {
        type: Number,
        default: 60
    }
});

const Task = mongoose.model("TaskSchema", TaskSchema, "users");

module.exports = {
    TaskSchema,
    Task,
};
