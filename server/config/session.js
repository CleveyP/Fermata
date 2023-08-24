const session = require("express-session");
const mongoStore = require("connect-mongo");
require('dotenv').config();

module.exports = (app) => {
    
    app.use(session({
        name: "fermat",
        secret: "secret",
        store: new mongoStore({
            mongoUrl: process.env.DATABASE_URL
        }),
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2
        }
    }))
    }