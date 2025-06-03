const Stay = require('./models/Stay.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const{staySchema,reviewSchema} = require('./schema.js');


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectPath = req.originalUrl;
        req.flash("error","you need to log in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectPath=(req,res,next)=>{
    res.locals.redirectPath = req.session.redirectPath;
    next();
}

module.exports.validateUserforStay= async (req,res,next)=>{
    let {id} = req.params;
    let stay = await Stay.findById(id).populate("owner");
    if(stay.owner.username != req.user.username){
        req.flash("error" , "You dont have permission to delete this listing");
        return res.redirect(`/stays/${id}`);
    }
    next();
}

module.exports.validateUserforReview= async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId).populate("author")
    if(review.author.username != req.user.username){
        req.flash("error" , "You dont have permission to delete this listing");
        return res.redirect(`/stays/${id}`);
    }
    next();
}

module.exports.validateStay = (req,res,next)=>{
    let { error } = staySchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}