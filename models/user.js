const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

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

const User = mongoose.model("User", userSchema);
module.exports = User;