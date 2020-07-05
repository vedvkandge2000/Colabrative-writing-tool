const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-vedant:"+process.env.PASSWORD+"@cluster0-pppat.mongodb.net/SDSTaskDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});


mongoose.set("useCreateIndex", true);

module.exports.User = require("./user");
module.exports.Post = require("./post")