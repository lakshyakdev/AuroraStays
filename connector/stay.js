const Stay = require('../models/Stay.js');

module.exports.loadCreatePage = (req,res)=>{
    res.render('./stays/new.ejs');  
}

module.exports.loadIndexPage = async (req,res,next)=>{
    let allstayings = await Stay.find({});
    res.render('./stays/index.ejs',{allstayings});
}

module.exports.editRoute = async(req,res,next)=>{
    let {id} = req.params;
    let stay = await Stay.findById(id);
    if (!stay) {
        req.flash("error" , "Accommodation not found!");
        res.redirect("/stays")
    }
    let updatedStay = req.body.stay;
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filrname;
        updatedStay.image = {url,filename};
    }
    await Stay.findByIdAndUpdate(id,updatedStay);
    req.flash("success" , "Stay successfully updated!");
    res.redirect(`/stays/${id}`);
}

module.exports.loadViewPage = async (req,res,next)=>{
    let {id} = req.params;
    let stay = await Stay.findById(id).populate({path: "reviews", populate: {path: "author",},}).populate("owner");
    if (!stay) {
        req.flash("error" , "Accommodatin not found!");
        res.redirect("/stays")
    }
    res.render('./stays/view.ejs',{stay});
}

module.exports.createRoute  = async(req,res,next)=>{
    let newStay = new Stay(req.body.stay) ;
    newStay.owner = req.user;
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filrname;
        newStay.image = {url,filename};
    }
    await newStay.save();
    req.flash("success" , "Property successfully Added!");
    res.redirect("/stays");
}

module.exports.loadEditPage = async (req,res,next)=>{
    let {id} = req.params;
    let stay = await Stay.findById(id);
    if (!stay) {
        req.flash("error" , "Accommodation not found!");
        res.redirect("/stays")
    }
    res.render("./stays/edit.ejs", {stay});
}

module.exports.deleteRoute = async (req,res,next)=>{
    let {id} = req.params;
    let stay = await Stay.findById(id);
    if (!stay) {
        req.flash("error" , "Accommodation not found!");
        res.redirect("/stays")
    }
    await Stay.findByIdAndDelete(id);
    req.flash("success" , "Property successfully Deleted!");
    res.redirect("/stays");
}

module.exports.booking = (req,res)=>{
    res.render("./stays/successfullBooking.ejs");
}
module.exports.privacy = (req,res)=>{
    res.render("./Privacy&Terms/privacy.ejs");
}
module.exports.terms = (req,res)=>{
    res.render("./Privacy&Terms/Terms.ejs");
}