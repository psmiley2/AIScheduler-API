/* -------------------------------------------------------------------------- */
/*                                    SetUp                                   */
/* -------------------------------------------------------------------------- */
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const passport = require("passport");
const session = require("express-session");
var MongoStore = require("connect-mongo")(session);
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
var schedule = require('node-schedule');
const schedulingRoutes = require("./routes/scheduling")
const habitRoutes = require("./routes/habits")
const doTodayRoutes = require("./routes/doTodays")

const User = require("./models/User");
let app = express();

// Passport Config
require("./config/passport")(passport);

// Database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Express Body Parser
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// app.set("trust proxy", true);

// Cors
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
// Express session
app.use(
    session({
        secret: "secret", // TODO -  MAKE THIS A LEGIT AND HIDDEN SECRET
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 2 * 60 * 60 * 1000 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 2 * 24 * 60 * 60,
        }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/habits", habitRoutes)
app.use("/tasks", taskRoutes);
app.use("/doToday", doTodayRoutes);
app.use("/scheduling", schedulingRoutes);

// At 2AM every day, completed tasks get archived, completed habits have their counters incremented, and unfinished tasks will be restored.
var day = schedule.scheduleJob({hour: 2, minute: 0, second: 0}, async function(){
    let allUsers = []
    await User.find({}).then((res) => {
        allUsers = res
    }).catch((err) => {
        console.error(err)
    })

    // Loop through every user that exists in the database
    for (let i = 0; i < allUsers.length; i++) {
        let user = allUsers[i]
        let habits = user.habits
        let tasksWithoutNull = []
        // Loop through each habit for the user and make the appropriate updates
        for (const key in habits) {
            if (habits[key].doToday === false) {
                continue
            }
            if (habits[key].completed) {
                habits[key].weeklyCounter = habits[key].weeklyCounter + 1
                habits[key].completed = false
            }
            habits[key].doToday = false
        }
        // Loop through each task for the user and make the appropriate updates
        let tasks = user.tasks
        for (const key in tasks) {
            if (tasks[key].doToday === false) {
                continue
            }
            if (tasks[key].completed === false) {
                tasks[key].doToday = false
                tasksWithoutNull.push(tasks[key])
            }
        }

        // Push the updates to the database
        User.findByIdAndUpdate(user._id, {"habits": habits, "tasks": tasksWithoutNull}).catch((err) => {
            console.error(err)
        })
    }

    console.log("Finished Daily Update")
  });

// At Sunday at 3AM every week, the habit weekly counters will get reset
var week = schedule.scheduleJob({dayOfWeek: 0, hour: 2, minute: 0, second: 0}, async function(){
    let allUsers = []
    await User.find({}).then((res) => {
        allUsers = res
    }).catch((err) => {
        console.error(err)
    })

    // Loop through every user that exists in the database
    for (let i = 0; i < allUsers.length; i++) {
        let user = allUsers[i]
        let habits = user.habits
        // Loop through each habit for the user and make the appropriate updates
        for (const key in habits) {
            habits[key].weeklyCounter = 0
        }

        // Push the updates to the database
        User.findByIdAndUpdate(user._id, {"habits": habits}).catch((err) => {
            console.error(err)
        })
    }

    console.log("Finished Weekly Update")
  });

// Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Listening on PORT: ${PORT}`));
