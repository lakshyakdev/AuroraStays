const Stay = require('../models/Stay.js');
const Review = require('../models/review.js');
module.exports.addReview = async(req,res)=>{
    let id = req.params.id;
    let stay = await Stay.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    stay.reviews.push(review);
    review.save();
    stay.save();
    req.flash("success" , "Review successfully added!");
    res.redirect(`/stays/${id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let {id, reviewId} = req.params;
    await Stay.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review successfully deleted!");
    res.redirect(`/stays/${id}`);
}