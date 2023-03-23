const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { TRANSPORTER_EMAIL, TRANSPORTER_PASSWORD } = require('../secretKeys');



// Setting up transporter with Gmail service to be able to send mails to the users
let transporter = nodemailer.createTransport(
    {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: TRANSPORTER_EMAIL,
            pass: TRANSPORTER_PASSWORD
        },
    },
    (err) => {
        console.log(err);
        return;
    }
);

// we are going to use ejs for mail template and also providing the path for the file
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, "../views/mailer", relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log("error in rendering template", err);
                return;
            }

            mailHTML = template;
        }
    );

    return mailHTML;
};

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate,
};
