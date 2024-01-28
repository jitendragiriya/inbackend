const express = require("express");
const app = express();
const cors = require("cors");
const connectDatase = require('./config/database')
const session = require('express-session');
const cron = require('node-cron')

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("files"));

// importing the configuration file when app is not in production.
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./config/config.env" });
}

app.use(
    cors({
        origin: [
            `${process.env.DEVELOPMENT_CORS}`,
            `${process.env.PRODUCTION_CORS}`,
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

// required for passport session
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false, maxAge: 60000 * 60 * 24 * 365 }
}));


// Connect to MongoDB
connectDatase()

const user = require("./routes/user");
const User = require("./models/users");
const sendMail = require("./utils/send-mail");
app.use("/api", user);

app.get("/", (req, res) => {
    res.send("Api running...");
});


// Cron job to check and send emails every day at a specific time (adjust as needed)
 
cron.schedule('0 0 * * *', () => {
    const currentDate = new Date();
    const users = User.find()
    users.forEach((user) => {
        const lastActivityDate = new Date(user.lastActivity);
        const daysSinceLastActivity = Math.floor((currentDate - lastActivityDate) / (1000 * 60 * 60 * 24));

        if (daysSinceLastActivity > 5) {
            sendMail({
                email:user.email,
                message:"You are inactive from last few days. please check out our app.",
                subject:"Inactivation"
            });
        }
    });
});

module.exports = app;