const mongoose = require("mongoose");
const validator = require('validator');
const Schema = mongoose.Schema;

const Driver = new Schema({
	username: { 
		type: String, 
		unique: true,
		required:[true, 'Username required'] 
	},
	password: {
		type: String,
		match:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/,
		required:[true, 'Password required']
	},
	email: { 
		type: String, 
		unique: true,
		validate: [validator.isEmail, 'Enter a valid email address.'] 
	},
	name: String,
	age: String,
	mobile: Number,
	truckNum: String,
	capacity: String,
	transporterName: String,
	experience: String,
	book: [mongoose.Types.ObjectId],
});

const Route = new Schema({
	from: { type: String, unique: true },
	to: { type: String, unique: true },
	Drivers: [Driver],
});

module.exports.Driver = mongoose.model("driver", Driver);
module.exports.Route = mongoose.model("route", Route);
