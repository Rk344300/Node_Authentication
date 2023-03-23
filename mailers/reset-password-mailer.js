const nodeMailer = require("../config/nodemailer");
const User = require("../models/user");

const { EMAIL_NODEMAILER } = require("../secretKeys");

exports.resetPasswordLink = async (user) => {
    // Defining template that will be used for sending mails
    let htmlString = nodeMailer.renderTemplate(
        { user: user },
        "/reset-password.ejs"
    );
    var mailOptions =
    {

        from: EMAIL_NODEMAILER,
        to: user.email,
        subject: "Password Reset Link - " + user.name,
        html: htmlString,
    }

    nodeMailer.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error in sending mail", err);
            return;
        }
        //console.log("info", info);
        return;
    }
    );
};
