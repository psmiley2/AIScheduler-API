const mongoose = require("mongoose");
// const { TaskListSchema } = require("./Task");
// const { GoalSchema } = require("./Goal");
// const { PreferenceSchema } = require("./Preference");
// const { EventSchema } = require("./Event");
const {TaskSchema} = require("./Task")
const {HabitSchema} = require("./Habit");
const { AllowSchedulingIntervalSchema } = require("./DoNotSchedule");

const UserSchema = new mongoose.Schema({
    userInfo: {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
    },
    habits: {
        type: [HabitSchema],
        default: [],
    },
    tasks: {
        type: [TaskSchema],
        default: [],
    },
    allowSchedulingInterval: {
        type: AllowSchedulingIntervalSchema,
        default: {}
    }
});

const User = mongoose.model("UserSchema", UserSchema, "users");

module.exports = User;
