const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require('../controllers/users_controller');


// sign-up route
router.get("/sign-up", usersController.signUp);

//sign-in route
router.get("/sign-in", usersController.signIn);

//create User route
router.post("/create", usersController.create);

// create session route
router.post("/create-session", passport.authenticate('local', { failureRedirect: "/users/sign-in" }),
    usersController.createSession)
// signout route
router.get("/logout", passport.checkAuthentication, usersController.destroySession);

//routes for reset password

router.get("/reset-password/", passport.checkAuthentication, usersController.resetPassword)
router.get("/reset-password-token/:id/:token", passport.checkAuthentication, usersController.Check_Token_ResetPassword);

router.post("/reset-password-token/:id/:token", passport.checkAuthentication, usersController.password_change);

//social oauth
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
    usersController.createSession
);

module.exports = router;