const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { PASSPORT_GOOGLE_CLIENTID, PASSPORT_GOOGLE_CLIENTSECRET } = require("../secretKeys")


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: PASSPORT_GOOGLE_CLIENTID,
    clientSecret: PASSPORT_GOOGLE_CLIENTSECRET, // e.g. _ASDFA%KFJWIASDFASD#FAD-
    callbackURL: "http://localhost:7000/users/auth/google/callback",
},

    function (accessToken, refreshToken, profile, done) {

        // find a user
        User.findOne({ email: profile.emails[0].value }).exec(async function (err, user) {
            if (err) { console.log('error in google strategy-passport', err); return; }
            // console.log(accessToken, refreshToken);
            //  console.log(profile);

            if (user) {
                // if found, set this user as req.user
                return done(null, user);
            } else {
                //   Creating a salt, which will be used to hash the password
                const salt = await bcrypt.genSalt(10);

                const hashedPassword = await bcrypt.hash(
                    crypto.randomBytes(20).toString("hex"),
                    salt
                );

                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: hashedPassword,
                }, function (err, user) {
                    if (err) { console.log('error in creating user google strategy-passport', err); return; }

                    return done(null, user);
                });
            }

        });
    }


));


module.exports = passport;
