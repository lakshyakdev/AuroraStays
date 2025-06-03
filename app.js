const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require('./models/user.js');

if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const app = express();

const ExpressError = require('./utils/ExpressError.js');

app.set("view engine","ejs");
app.engine('ejs',ejsMate);
app.set("views", path.join(__dirname,"views"));

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true,
    }
};

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/AuroraStays';
async function main(){
   await mongoose.connect(dbUrl);
}


main()
.then(()=>{
    console.log("database connected successfully");
})
.catch((err)=>{
    console.log(err);
});

app.use((req, res, next) => {
    if (req.path.endsWith("/") && req.path !== "/") {
        return res.redirect(req.path.slice(0, -1));
    }
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/",(req,res)=>{
    res.render("./stays/homepage.ejs");
})

app.get("/check",(req,res)=>{
    console.log(res.locals.currUser);
    res.send("check console");
})
// app.get("/register",async (req,res)=>{
//     const newUser = {
//         email : "demouser@gmail.com",
//         username: "Demo User",
//     }

//     let register = await User.register(newUser,"abcd");
//     console.log(register);
//     res.send("successfull");
// })

const userRouter = require('./routes/user.js');
app.use("/",userRouter);

const staysRouter = require('./routes/Stay.js');
app.use("/stays" , staysRouter);

const reviewsRouter = require('./routes/review.js');
app.use("/stays/:id/reviews" , reviewsRouter);

app.use((req, res, next) => {
    let error = new ExpressError(404, "Page not found");
    next(error);
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{ message });
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})