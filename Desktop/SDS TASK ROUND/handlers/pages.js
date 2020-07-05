const db = require("../models");

module.exports.currentPost = function(req,res) {
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
     });
  };

module.exports.newPost = function(req,res) {
    res.render("compose");
};

module.exports.postFeature = function(req,res) {
    const action = req.body.button;
    const postID = req.body.postId;
    if(action === "edit"){
  
      db.Post.findOne({_id:req.body.id}, function(err, foundUser){
          if (err) {
            console.log(err);
          }else {
            res.render("edit",{ previouscontent:foundUser.content, postId:foundUser._id});
          }
       });
      }
    else if (action === "delete") {
          db.Post.findOneAndDelete({_id: req.body.id}, function(err) {
            if(!err){
              res.redirect("/myBlogs/"+req.user.id);
            }
          });
      }
      else if(action === 'share'){
        db.User.find(function(err, found) {
          console.log(found);
          res.render("share", {users: found, postID: postID});
        })
  
      }
  };

  module.exports.edit = function(req,res) {
    console.log(req.body.id);
    console.log(req.body.post);
  
  
  
    db.Post.findOneAndUpdate({_id:req.body.id}, {$set: {content:req.body.post}}, function(err) {
      if(err){
        res.send(err);
      }else{
        res.redirect("/myBlogs/"+req.user.id);
      }
    })
  
};

module.exports.share =  function(req,res) {
    const post_Id = req.body.postId;
    const user_Id = req.body.userId;
    db.Post.findById(post_Id,function (err,found_post) {
      if(!err){
        console.log(user_Id);
        found_post.contributor.push(user_Id);
        found_post.save(function(err) {
          if(!err){
            console.log(found_post.contributor);
            res.redirect("/posts/"+post_Id);
          }
        })
      }
    })
  };

  module.exports.compose = function(req,res) {

    const newPost = new db.Post({
      content:req.body.post,
      creator: req.user.id,
      creatorName: req.user.username,
      contributor: req.user.id
    });
      newPost.save(function(err) {
        if(err){
          console.log(err);
        }else {
          res.redirect("/myBlogs/"+req.user.id);
        }
      })
  };
  
  
  