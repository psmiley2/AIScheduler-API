const mongoose = require("mongoose");

const AllowSchedulingIntervalSchema = new mongoose.Schema({
    startTime: {
        type: String,
        default: "00:00"
    },
    endTime: {
        type: String,
        default: "00:00"
    },
});

const AllowSchedulingInterval = mongoose.model("AllowSchedulingIntervalSchema", AllowSchedulingIntervalSchema, "users");

module.exports = {
    AllowSchedulingInterval,
    AllowSchedulingIntervalSchema,
};
