
const bcrypt = require('bcrypt');
const User = require('../models/user');
const queue = require('../config/Kue');
const jwt = require("jsonwebtoken");
require("../worker/reset-password");

const { JWT_SECRET } = require("../secretKeys");


// render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        // render the home page if user is logged in
        return res.redirect("/");
    }

    return res.render("user_sign_up", {
        title: " Sign Up",
    });
};

// render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        //  render the home page if user is logged in
        return res.redirect("/");
    }

    return res.render("user_sign_in", {
        title: " Sign In"
    })
}

// create a user
module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            req.flash("error", "password and confirm password do not match");
            return res.redirect("back");
        }
        // Creating hashedpassword  using bcrypt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const ExistingUser = await User.findOne({ email: req.body.email });

        if (ExistingUser) {
            req.flash("error", "Email already exist");
            return res.redirect("back");
        }

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,

        });
        req.flash("success", "you are successfully sign up, login to continue");
        // console.log("user", user);
        return res.redirect("/users/sign-in");


    } catch (err) {
        console.log(err);
        req.flash("error", err);
        return res.redirect("back");
    }

}


//create session for the user who login

module.exports.createSession = function (req, res) {
    req.flash("success", "successfully Logged In");
    return res.redirect("/");
}
// destroy the session 
module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!!")
        return res.redirect("/users/sign-in");
    });

}

//   Send mail to the user when we click the reset password
module.exports.resetPassword = function (req, res) {
    //console.log("req.user", req.user);

    const { _id, email, password, name } = req.user;

    // JWT token created with secret and payload , so creating it
    const secret = JWT_SECRET + password;
    const payload = {
        email: email,
        id: _id,
    };

    // Creating a jwt token which will expires in 10 minute
    const token = jwt.sign(payload, secret, { expiresIn: "10m" }); // expires in 10 min

    //  add the id and token  to the link to used as a end-point for reset-password
    const link = `http://127.0.0.1:7000/users/reset-password-token/${_id}/${token}`;

    const SentData = {
        _id,
        email,
        password,
        name,
        link,
    };

    // console.log("SentData", SentData);

    //it will create a new queue and push the job to it if queue is not present , else it will push the job to the queue
    //   implementing parallel jobs by sending mails Using KUE
    let job = queue.create("resets", SentData).save(function (err) {
        if (err) {
            console.log("Error in sending to the queue", err);
            return;
        }
        // console.log("job", job);
    });

    req.flash("success", "Reset Link sent to your Mail - " + email);

    return res.redirect("/");
};



//   handle  Password change page
module.exports.Check_Token_ResetPassword = async function (req, res) {
    const { id, token } = req.params;

    // Get the user details
    let users = await User.findOne({ _id: id });

    if (!users) {
        // if user not found
        return req.flash("error", "User Not found");
    }

    const secret = JWT_SECRET + users.password;

    try {
        jwt.verify(token, secret);
        // If jwt is unable to verify the token then it will throw the error, so we are catching it in the catch block else render the reset-password page
        return res.render("reset-pass", {
            title: "Sign In",
            email: users.email,
        });
    } catch (error) {
        console.log("err", error.name + " ," + error.message);
        if (error.name === "TokenExpiredError") {
            req.flash(
                "error",
                "Link Expired, Kindly send another request to reset your password"
            );
            return res.redirect("/");
        }

        req.flash("error", `${error.name} - ${error.message}`);
        return res.redirect("/");
    }
};


//    Change the password and save it to the database
module.exports.password_change = async (req, res) => {

    // If password doesn't match
    if (req.body.password != req.body.confirm_password) {
        req.flash("error", "Passwords and confirm_password donot match");
        return res.redirect("back");
    }

    const { id, token } = req.params;

    // Get the user details
    let users = await User.findOne({ _id: id });

    if (!users) {
        return req.flash("error", "User Not found");
    }

    // Creating hash of the password using bcrypt 
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Updating the password field
    const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { password: hashedPassword }
    );

    req.flash("success", "Password Changed Successfully..");

    return res.redirect("/users/logout");
};
