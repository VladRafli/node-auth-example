/**
 * Modules
 */

// Express
const express = require('express');
// Cors
const cors = require('cors');
// Morgan
const morgan = require('morgan');
// Passport
const passport = require('passport');
// Passport Strategy
const Strategy = require('passport-local').Strategy;
// Express Session
const session = require('express-session');
// Database Helper
const dbConn = require('./database');
// Database Query
const db = require('./query');
// Dotenv
require('dotenv').config();

/**
 * Middlewares
 */

// Declare Express App
const app = express();
// Use Cors on App
app.use(cors());
// Use Morgan Tiny HTTP Logger
app.use(morgan('tiny'));
// Use Express Urlencoded Config
app.use(express.urlencoded({
    extended: true
}));
// Use Express Body Parser to JSON
app.use(express.json());
// Use Express Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
// Connect to Database
dbConn.authenticate()
    .then(() => {
        console.log('Database connection successfully established.');
        // Establish PORT to listen
        app.listen(process.env.PORT, console.log(`Server is running on port ${process.env.PORT}`));
    })
    .catch(e => {
        console.error(`Unable to connect to the database, Reason: ${e}`);
    });
// Configure Passport Local Strategy
passport.use(new Strategy((username, password, callback) => {
    db.findByUsername(username, (err, user) => {
        if(err) return callback(err);
        if(!user) return callback(null, false);
        if(user[0].Password != password) return callback(null, false)
        return callback(null, user);
    })
}))
// Serialize User
passport.serializeUser((user, callback) => {
    callback(null, user[0].IdUser);
});
// Deserialize User
passport.deserializeUser((id, callback) => {
    db.findById(id, (err, user) => {
        if(err) { return callback(err); }
        callback(null, user);
    })
});
// Initialize Passport
app.use(passport.initialize());
// Initialize Session
app.use(passport.session());

/* Routes */
app.get('/', async (req, res) => {
    if(req.query.id) {
        res.send(await db.findById(req.query.id, (err, data) => {
            if(err) return err;
        }));
    } else if(req.query.user) {
        res.send(await db.findByUsername(req.query.user, (err, data) => {
            if(err) return err;
        }));
    } else {
        res.send(await db.getAllUser());
    }
});
app.get('/login', (req, res) => {
    if(req.query.success == 1) {
        res.send('Login Failed!');
    } else {
        res.send('Login Successfull!');
    }
})
app.post('/login', passport.authenticate('local', { failureRedirect: '/login?success=1' }), async (req, res) => {
    res.redirect('/login?success=0');
})