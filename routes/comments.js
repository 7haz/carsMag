
 var express    = require("express"),
     Car        = require("../models/car"),
     Comment    = require("../models/comment"),
     router     = express.Router({ mergeParams: true}),
     middleware = require("../middleware");





      // Show new comment form 
 router.get("/new",middleware.isLoggedIn,function(req,res){
   Car.findById(req.params.id,function(err,foundCar){
     if(err || !foundCar){
         req.flash("error","You are lookin for a post that does not exist or deleted !");
         res.redirect("back");
     }else{
         res.render("comments/new",{car:foundCar});
     }
   });
 });
 
 
 
      // Creating and adding the new comment 
 router.post("/",middleware.isLoggedIn,function(req,res){
   Car.findById(req.params.id,function(err,foundCar){
     if(err || !foundCar){
         req.flash("error","You are lookin for a post that does not exist or deleted !");
         res.redirect("back");
     }else{
         var newComment = {
             text   : req.body.text ,
             author : {
                 id       : req.user._id ,
                 username : req.user.username 
             }
         }
           Comment.create(newComment,function(err,createdComment){
             if(!err && createdComment){
               foundCar.comments.push(createdComment);
               foundCar.save(function(err,savedCar){
                 if(!err && savedCar){
                    req.flash("success"," New comment added !");
                    res.redirect("/cars/"+savedCar._id);
                 }
               });
             }
       });
     }
   });
 });
 
 
 
      // Edit comment form 
 router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
     Comment.findById(req.params.comment_id,function(err, foundComment){
         if(err || !foundComment){
             req.flash("error","The comment you're looking for does not exist or deleted!");
             res.redirect("back");
         }else{
             res.render("comments/edit",{comment: foundComment,carId:req.params.id});
         }
     });
 });
 
 
 
      // Uptade comment
 router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
     Comment.findByIdAndUpdate(req.params.comment_id,{
         text:req.body.text
     },function(err,updatedComment){
         if(err || !updatedComment){
             req.flash("error","could not update the comment or the comment is deleted!");
             res.redirect("back");
         }else{
            req.flash("info","Your comment has been updated !");
            res.redirect("/cars/"+req.params.id);
         }
     });
 });
 
 
 
      // Destroy comment 
 router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
     Comment.findByIdAndRemove(req.params.comment_id,function(err){
         if(err){
             req.flash("error",err.massage);
             res.redirect("back");
         }else{
             req.flash("info","Your comment is deleted !");
             res.redirect("/cars/"+req.params.id);
         }
     });
 });
 
 
 
 
 module.exports = router ;