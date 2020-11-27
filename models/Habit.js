const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
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
        default: "habit"
    },
    priority: {
        type: Number,
        default: 1
    },
    timesPerWeek: {
        type: Number,
        default: 1
    },
    weeklyCounter: {
        type: Number,
        default: 0
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

const Habit = mongoose.model("HabitSchema", HabitSchema, "users");

module.exports = {
    Habit,
    HabitSchema,
};
