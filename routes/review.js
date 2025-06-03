const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require('../utils/wrapAsync.js');
const reviewConnector = require("../connector/review.js")


const {validateUserforReview , validateReview} = require("../middleware.js");
 
//review add
router.post("/",validateReview,wrapAsync(reviewConnector.addReview));

//review delete
router.delete("/:reviewId",validateUserforReview,wrapAsync(reviewConnector.deleteReview));
module.exports = router;