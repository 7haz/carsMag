

// Middleware configuration 


 var Car     = require("../models/car"),
     Comment = require("../models/comment");
     
     
     
 var middlewareObj = {} ;
 
 
 
 
 middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    req.flash("error"," You need to be logged in .. ");
    res.redirect("/login");
 };
 
 
 
 middlewareObj.isNotLoggedIn = function(req,res,next){
     if(req.isAuthenticated()){
         req.flash("error","You are already logged in ");
         res.redirect("/cars");
     }else{
         return next();
     }
 };
 
 
 middlewareObj.checkCarOwnership = function(req,res,next){
        if(req.isAuthenticated()){ 
            Car.findById(req.params.id,function(err, foundCar){
                if(err || !foundCar){
                    req.flash("error","You are looking for a post that does not exist or deleted!");
                    res.redirect("/cars");
                }else{
                    if(foundCar.author.id.equals(req.user._id)){
                        // He is loged in and he is the owner 
                        return next() ;
                    }else{
                        // He is loged in but not the owner
                        req.flash("error"," You are not authorized to Edit/Delete this content !")
                        res.redirect("/cars/"+req.params.id);
                    }
                }
            });
        }else{
            // He is not loged in 
            req.flash("error"," You need to be logged in .. ");
            res.redirect("/login");
        }
 };
 
 
 
 
 middlewareObj.checkCommentOwnership = function(req,res,next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id,function(err, foundComment){
             if(err || !foundComment){
                 req.flash("error","Comment does not exist or deleted !");
                 res.redirect("/cars/"+req.params.id);
             }else{
                 if(foundComment.author.id.equals(req.user._id)){
                     // He is the owner 
                     return next() ;
                 }else{
                     // He is not the owner
                     req.flash("error"," You are not authorized to Edit/Delete this content !");
                     res.redirect("/cars/"+req.params.id);
                 }
             }
         });
     }else{
         // He is not loged in 
         req.flash("error"," You need to be logged in .. ");
         res.redirect("/login");
     }
 };
 
 

 
 
 module.exports = middlewareObj ;