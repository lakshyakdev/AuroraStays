const express = require("express");
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');

const { isloggedin,validateUserforStay,validateStay} = require('../middleware.js');
const stayConnector = require("../connector/stay.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(stayConnector.loadIndexPage)) //Index Page
    .post(isloggedin,upload.single("stay[image]"), validateStay ,wrapAsync(stayConnector.createRoute)); //CreateRoute

router
    .route("/new")
    .get(isloggedin,stayConnector.loadCreatePage); //load create page

router.get("/booking",isloggedin,stayConnector.booking);
router.get("/terms",stayConnector.terms);
router.get("/privacy",stayConnector.privacy);
router.get("/search",wrapAsync(stayConnector.search));

router
    .route("/:id")
    .get(wrapAsync(stayConnector.loadViewPage)) //ViewPage
    .put(upload.single("stay[image]"),validateStay, wrapAsync(stayConnector.editRoute)) //editRoute
    .delete(isloggedin,validateUserforStay,wrapAsync(stayConnector.deleteRoute)) //deleteRoute

router
    .route("/:id/edit")
    .get(isloggedin,validateUserforStay,wrapAsync(stayConnector.loadEditPage));  //load edit page

module.exports = router;