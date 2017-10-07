



// node packages setup


var express       = require("express"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    methodOverride= require("method-override"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    
    app           = express(),  
// models   
    User          = require("./models/user"),
    Car           = require("./models/car"),
    Comment       = require("./models/comment"),
// Routes    
    indexRoutes   = require("./routes/index"),
    carRoutes     = require("./routes/cars"),
    commentRoutes = require("./routes/comments");


  var DBurl = process.env.DATABASEURL || "mongodb://localhost/carsMag" ;
  mongoose.connect(DBurl,{useMongoClient:true});



  mongoose.Promise = global.Promise;
  app.set("view engine","ejs");
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static(__dirname+"/public"));
  app.use(methodOverride("_method"));
  app.use(flash());




 
// Passport configuration


 app.use(require("express-session")({ 
    secret:"No Idea what is this",
    resave:false,
    saveUninitialized:false}));
 app.use(passport.initialize());
 app.use(passport.session());
 
 passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());



 app.use(function (req,res,next){
   res.locals.currentUser = req.user ;
   res.locals.error = req.flash("error") ;
   res.locals.success = req.flash("success") ;
   res.locals.info = req.flash("info") ;
   next() ;
 });
 
 
 app.use(indexRoutes);
 app.use("/cars",carRoutes);
 app.use("/cars/:id/comments",commentRoutes);




  app.get("*",function(req,res){
      req.flash("error","Sorry , Page not found !");
      res.redirect("/cars");
  });
 






 //    Server setup


 app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server Connected ..");
   console.log("PORT :" ,process.env.PORT);
 });