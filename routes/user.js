const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const passport = require("passport");
const {redirectPath} = require("../middleware.js")
const userConnector = require("../connector/user.js")

router
    .route("/signup")
    .get(userConnector.loadSignupPage)
    .post(wrapAsync(userConnector.signupRoute));

router
    .route("/login")
    .get(userConnector.loadLoginPage)
    .post(redirectPath,passport.authenticate(
    "local",{failureRedirect:"/login",failureFlash:true})
    ,userConnector.loginRoute 
    );

router
    .route("/logout")
    .get(userConnector.logoutRoute );

module.exports = router;