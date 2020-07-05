const express = require("express");
const db = require("../models");
const router = express.Router({ mergeParams: true });
const { login, register } = require("../handlers/auth");
const { forgot, reset } = require("../handlers/forgot");
const {currentPost, newPost, postFeature, edit, share, compose} = require("../handlers/pages");

const aboutContent = "A collaborative real-time editor is a type of collaborative software or web application which enables real-time collaborative editing, simultaneous editing of documents";
const contactContent = "Web application is Developed by Vedant V. Kandge in guidence with SDS";


router.get("/",function(req,res) {
    res.render("start");
  });

router.get("/forgot",function(req,res) {
    res.render("forgot")
  });


  router.get("/login",function(req,res) {
    res.render("login")
  });
  
  router.get("/register",function(req,res) {
    res.render("register")
  });

  router.get("/logout",function(req,res) {
    req.logout();
    res.redirect("/");
  });

  router.post("/forgot", forgot);

  router.get("/reset/:token",function(req,res) {
    db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });

  router.post("/reset/:token", reset);

  router.post("/register", register);

  router.post("/login", login);

  router.get("/myBlog",function(req,res) {
    if(req.isAuthenticated()){
        res.redirect("/myBlogs/"+req.user.id);
    }else {
      res.redirect("/login");
    }
  });

  router.get("/posts/:postId", function(req,res) {
    const requestedId = req.params.postId;
    const pageName = req.body.button;
  
    db.Post.findOne({_id: requestedId}, function(err, foundPost){
  
          if(pageName === "myBlogs"){
            res.render("post",{
              bodyContent:foundPost.content,
              postId:requestedId,
              postDate:foundPost.updatedAt,
              creatorId:foundPost.creator,
              postedBy: foundPost.creatorName
            });
          }
          else{
            res.render("Post",{
              bodyContent:foundPost.content,
              postId:requestedId,
              postDate:foundPost.updatedAt,
              creatorId:foundPost.creator,
              postedBy: foundPost.creatorName
            });
          }
     });
  });

  router.get("/myBlogs/:userId",function(req,res) {
    const requestedUserId = req.params.userId;
    
    db.Post.find({contributor:requestedUserId},function(err,foundPosts) {
      
      if(err){
      console.log(err);
    }else {
      if(foundPosts){
        res.render("myBlogs", {posts: foundPosts, userId:requestedUserId})
      }
    }
  });
  });

  router.get("/about",function(req,res) {
    res.render("about",{aboutContent:aboutContent});
  });
  
  router.get("/contact",function(req,res) {
    res.render("contact",{contactContent:contactContent});
  });

  router.post("/posts/:postId",currentPost);

  router.post("/new", newPost);

  router.post("/post", postFeature);

  router.post("/edit", edit);
  
  router.post("/share", share);

  router.post("/compose", compose);
  

  module.exports = router;
  
