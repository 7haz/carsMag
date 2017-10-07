

 var express    = require("express"),
     passport   = require("passport"),
     User       = require("../models/user"),
     middleware = require("../middleware"),
     router     = express.Router();




 // Home page 

 router.get("/",function(req,res){
     res.render("landing");
 });
 
 
 
 
 // Register form 
 
 router.get("/register",middleware.isNotLoggedIn,function(req, res) {
     res.render("users/register");
 });
 
 
 
 // Register post
 
 router.post("/register",middleware.isNotLoggedIn,function(req, res) {
     User.register(new User({username:req.body.username }),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome "+req.user.username+" , nice to meet you !");
                res.redirect("/cars");
            });
        }    
     });
 });
 
 
 
 //login form 
 
 router.get("/login",middleware.isNotLoggedIn, function(req, res) {
    res.render("users/login"); 
 });
 
 
 
 // login Post
 
 router.post("/login", middleware.isNotLoggedIn, passport.authenticate("local",{
      successRedirect : "/cars",
      failureRedirect : "/login"
    }));
 
 
 
 //logout
 
 router.get("/logout",function(req,res){
    req.logout();
    req.flash("info"," You are logged out !");
    res.redirect("/cars");
 });
 
 
 
 
 module.exports = router ;