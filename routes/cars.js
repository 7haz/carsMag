

 var express    = require("express"),
     Car        = require("../models/car"),
     router     = express.Router(),
     middleware = require("../middleware");






    // index route
 router.get("/",function(req,res){
     var resultsMessage ;
     if(req.query.search){
         
         const regex = new RegExp(escapeRegex(req.query.search),"gi");
         Car.find({"name":regex},function(err,cars){
            if(err){
                 console.log("finding object error !!".err);
            }else{
                 if(cars.length < 1){
                     resultsMessage = "No cars found , please try again .." ;
                 }
                 res.render("cars/index",{ cars:cars , resultsMessage:resultsMessage });
            }
         });   
         
     }else{
         
         Car.find({},function(err,cars){
            if(err){
                 console.log("finding object error !!".err);
            }else{
                 if(cars.length < 1){
                     resultsMessage = "This category is currently empty .. " ;
                 }
                 res.render("cars/index",{ cars:cars , resultsMessage:resultsMessage});
            }
        });   
     }
     
  });
 
 
 
 
 
 
    // new form
 router.get("/new",middleware.isLoggedIn,function(req,res){
   res.render("cars/new");
 });
 
 
 
 
 
    // creating new car 
 router.post("/",middleware.isLoggedIn,function(req,res){
        Car.create(
          {
             name:req.body.carName,
             img:req.body.url ,
             info:req.body.info,
             author:{
                 id:req.user._id ,
                 username:req.user.username
             }
          },
          function(err,createdCar){
            if(err){
                req.flash("error","Error creating the post, please try again .. ");
                res.redirect("back");
            }else{
                req.flash("success"," Post added successfully !" );
                res.redirect("/cars");
            }
        });
     
    });
 
 
 
 
    // show route  
 router.get("/:id",function(req,res){
        Car.findById(req.params.id).populate("comments").exec(function(err,foundCar){
           if(err || !foundCar){
               req.flash("error","You are looking for a post that does not exist or deleted !");
               res.redirect("/cars");
           }else{
               res.render("cars/show",{car:foundCar});
           }
        });
 });





    // show edit form 
 router.get("/:id/edit",middleware.checkCarOwnership,function(req, res) {
     Car.findById(req.params.id,function(err,foundCar){
         if(err || !foundCar){
             req.flash("error","You are looking for a post that does not exist or deleted !");
             res.redirect("back");
         }else{
                 res.render("cars/edit",{car:foundCar});
         }
         
     });
 });




    //  Updtae 
 router.put("/:id",middleware.checkCarOwnership,function(req,res){
     Car.findByIdAndUpdate(req.params.id,{
         name : req.body.name,
         img  : req.body.img ,
         info : req.body.info
     },function(err,updatedCar){
         if(err || !updatedCar){
             req.flash("error","Error looking up the post");
             res.redirect("back");
         }else {
             req.flash("info"," Post updated successfully !");
             res.redirect("/cars/"+updatedCar._id);
         }
     });
 });
 
 
 
 
 
    // Delete a car
 router.delete("/:id",middleware.checkCarOwnership,function(req,res){
     Car.findByIdAndRemove(req.params.id,function(err){
         if(err){
             req.flash("error",err.massage);
             res.redirect("back");
         }else{
             req.flash("info"," Your post has been deleted !");
             res.redirect("/cars");
         }
     });
 });
 

 function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
 
 
 
 module.exports = router ;