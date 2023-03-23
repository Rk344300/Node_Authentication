const express = require('express');
const passport = require('passport');

const homeController = require("../controllers/home_controller");

const router = express.Router();
//when user is logged in this route work and call homeController
router.get("/", passport.checkAuthentication, homeController.homePage);

router.use("/users", require('./users'));
module.exports = router;