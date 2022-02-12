const mongoose = require("mongoose");
const validator = require('validator');
const Schema = mongoose.Schema;

const Dealer = new Schema({
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
	mobile: Number,
	material: String,
	weight:String,
	quantity:String,
	state: String,
	city: String,
	booked: [[mongoose.Types.ObjectId, String, String]], // [driverId,from,To]
});

module.exports = mongoose.model("dealer", Dealer);
