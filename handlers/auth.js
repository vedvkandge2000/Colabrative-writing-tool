const db = require("../models");
const passport = require('passport');
const passwordValidator = require("password-validator");

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
    
    module.exports.login = function(req,res) {
        const user = new db.User({
          username: req.body.username,
          password: req.body.password
        });
      
        req.login(user, function(err) {
          if(err){
            console.log(err);
          }else{
            passport.authenticate("local")(req,res,function() {
              res.redirect("/myblog");
            });
          }
        });
      };
      
      module.exports.register = function(req,res) {
        if (passSchema.validate(req.body.password)) {
          if (req.body.password === req.body.confirm) {
            db.User.register({
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
    };