const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/SDSTaskDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});


mongoose.set("useCreateIndex", true);

module.exports.User = require("./user");
module.exports.Post = require("./post")