
require('dotenv').config()
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const async = require('async');
const nodemailer = require("nodemailer");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const crypto = require("crypto");
const passwordValidator = require("password-validator");


// Password validator.
var passSchema = new passwordValidator();
passSchema
	.is()
	.min(8) // Minimum length 8
	.is()
	.max(15) // Maximum length 15
	.has()
	.uppercase() // Must have uppercase letters
	.has()
	.lowercase() // Must have lowercase letters
	.has()
	.digits() // Must have digits
	.has()
	.symbols() // Must have symbols
	.has()
	.not()
	.spaces(); // Dose not contain space


var ObjectId = mongoose.Schema.ObjectId;

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis   vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

io.on('connection', (socket) => {
  console.log('New WebSocket connection')


    // socket.emit('message', 'Welcome!')
    socket.on('message', (message) => {
             console.log(message)
             socket.broadcast.emit('message', message)
         })
    
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})


app.use(session({
  secret: 'our little secret.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/SDSTaskDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});


mongoose.set("useCreateIndex", true);


const postSchema = new mongoose.Schema({
  content: {
    type: String,
    createIndexes: true
  },
  creator: {
    type: mongoose.Schema.ObjectId,
     ref: 'userSchema',
     createIndexes: true
   },
   creatorName: {
     type: String,
     createIndexes: true
   },
   contributor:[{
     type: mongoose.Schema.ObjectId,
     createIndexes: true
   }]
},{
  timestamps: true
});


const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		createIndexes: true,
	},
	middlename: {
		type: String,
		createIndexes: true,
	},
	lastname: {
		type: String,
		createIndexes: true,
	},
	username: {
		type: String,
		createIndexes: true,
	},
	password: {
		type: String,
		createIndexes: true,
	},
	// googleId: {
	//   type: String,
	//   createIndexes: true
	// },
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const Post = mongoose.model("Post",postSchema);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//passport.use(new GoogleStrategy({
//    clientID: process.env.CLIENT_ID,
//    clientSecret: process.env.CLIENT_SECRET,
//    callbackURL: "https://safe-dawn-50975.herokuapp.com/auth/google/Blogging",
//  },
//  function(accessToken, refreshToken, profile, cb) {
//    User.findOrCreate({ googleId: profile.id, username:profile.emails[0].value }, function (err, user) {
//      return cb(err, user);
//    });
//  }
//));


app.get("/",function(req,res) {
  res.render("start");
});

app.get("/forgot",function(req,res) {
  res.render("forgot")
})

app.get("/myBlog",function(req,res) {
  if(req.isAuthenticated()){
      res.redirect("/myBlogs/"+req.user.id);
  }else {
    res.redirect("/login");
  }
})

//  app.get("/auth/google",
//  passport.authenticate("google", { scope: ["profile", "email"] }));

  // app.get("/auth/google/Blogging",
  //   passport.authenticate("google", { failureRedirect: "/login" }),
  //   function(req, res) {
  //     // Successful authentication, redirect Home page.
  //     res.redirect("/home");
  // });

  app.get("/login",function(req,res) {
  res.render("login")
});

app.get("/register",function(req,res) {
  res.render("register")
});




app.get("/logout",function(req,res) {
  req.logout();
  res.redirect("/");
});


app.get("/posts/:postId", function(req,res) {
  const requestedId = req.params.postId;
  const pageName = req.body.button;

  Post.findOne({_id: requestedId}, function(err, foundPost){
        
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

app.post("/forgot",function(req,res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'nodeproject2020@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'nodeproject2020@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });

});

app.get("/reset/:token",function(req,res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

app.post("/reset/:token",function(req,res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'nodeproject2020@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'nodeproject2020@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/home');
  });
});

app.post("/posts/:postId",function(req,res) {
  const requestedId = req.params.postId;
  const pageName = req.body.button;

  Post.findOne({_id: requestedId}, function(err, foundPost){

        
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
});

app.get("/myBlogs/:userId",function(req,res) {
  const requestedUserId = req.params.userId;
  // console.log(requestedUserId);
  Post.find({contributor:requestedUserId},function(err,foundPosts) {
    // console.log(foundPosts);
    if(err){
    console.log(err);
  }else {
    if(foundPosts){
      res.render("myBlogs", {posts: foundPosts, userId:requestedUserId})
    }
  }
});
});

app.post("/register", function(req,res) {
  if (passSchema.validate(req.body.password)) {
    if (req.body.password === req.body.confirm) {
      User.register({
        username: req.body.username,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname
      }, req.body.password,function(err,user) {
        if(err){
          console.log(err);
          res.redirect("/register");
        }else{
          passport.authenticate("local")(req,res,function() {
            res.redirect("/myblog")
          });
        }
      });
    }else{
      console.log("Passwords do not match");
			res.redirect("/register");
    }
  }else{
    console.log("Password not validated");
		res.redirect("/register");
  }

  

});

app.post("/login", function(req,res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function() {
        res.redirect("/myblog");
      })
    }
  })
});



app.get("/about",function(req,res) {
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res) {
  res.render("contact",{contactContent:contactContent});
});

app.post("/new",function(req,res) {
    res.render("compose");
});

app.post("/post",function(req,res) {
  const action = req.body.button;
  const postID = req.body.postId;
  if(action === "edit"){

    Post.findOne({_id:req.body.id}, function(err, foundUser){
        if (err) {
          console.log(err);
        }else {
          res.render("index",{ previouscontent:foundUser.content, postId:foundUser._id});
        }
     });
    }
  else if (action === "delete") {
        Post.findOneAndDelete({_id: req.body.id}, function(err) {
          if(!err){
            res.redirect("/myBlogs/"+req.user.id);
          }
        });
    }
    else if(action === 'share'){
      User.find(function(err, found) {
        console.log(found);
        res.render("share", {users: found, postID: postID});
      })
      
    }
});



app.post("/edit",function(req,res) {
  console.log(req.body.id);
  console.log(req.body.post);
  
  

  Post.findOneAndUpdate({_id:req.body.id}, {$set: {content:req.body.post}}, function(err) {
    if(err){
      res.send(err);
    }else{
      res.redirect("/myBlogs/"+req.user.id);
    }
  })

});

app.post("/share", function(req,res) {
  const post_Id = req.body.postId;
  const user_Id = req.body.userId;
  Post.findById(post_Id,function (err,found_post) {
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
})


app.post("/compose",function(req,res) {

  const newPost = new Post({
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
})




let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}



server.listen(port, function() {
  console.log("Server started on port!");
});




