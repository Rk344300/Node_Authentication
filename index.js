const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');


const cookieParser = require('cookie-parser');

//passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const paaportGoogle = require('./config/passport-google-oauth');

//Express Session
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const customMware = require("./config/flash-middleware");
const kue = require('kue');

const port = 7000;

const db = require('./config/mongoose');
const { SESSION_SECRET_KEY } = require("./secretKeys");

//adding static files
app.use(express.static("./assets"));

//middleware used to parse the data coming from the ejs form
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);


app.use(
    session({
        name: 'Node-Authentication',
        secret: SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },
        store: MongoStore.create(
            {
                mongoUrl: `mongodb://127.0.0.1:27017/DB_node`,
                autoRemove: 'disabled'

            },
            function (err) {
                console.log(err || 'connect-mongodb setup ok');
            }
        )
    }));

//initializing the passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);




// setting up flash middleware
app.use(flash());
app.use(customMware.setFlash);


app.use("/", require('./routes'));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");




app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server:${err}`);
    }
    console.log(`Server is running on port:${port}`);
})

