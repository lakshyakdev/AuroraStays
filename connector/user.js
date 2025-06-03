const User = require('../models/user.js');

module.exports.loadSignupPage = (req,res)=>{
    res.render("signup.ejs");
}

module.exports.signupRoute = async (req,res)=>{
    let{username , email, password}= req.body;
    let newUser = await User.register({ username: username , email: email},password);
    
    req.login(newUser, (err)=>{
        if(err) throw err;
        req.flash("success","Welcome to AuroraStays");
        res.redirect("/stays");
    });
}

module.exports.loadLoginPage =  (req,res)=>{
    res.render("login.ejs");
}

module.exports.loginRoute = (req,res)=>{
    req.flash("success","Welcome back");
    let redirectUrl = res.locals.redirectPath || "/stays";
    res.redirect(redirectUrl);
}

module.exports.logoutRoute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        let redirectUrl = res.locals.redirectPath || "/stays";
        req.flash("success", "Successfully logged you out");
        res.redirect(redirectUrl);
    });
}