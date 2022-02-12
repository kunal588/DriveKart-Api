const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Dealer = new Schema({
	username: { type: String, unique: true,required:[true, 'Username required'] },
	password: {
		type: String,
		match: "/^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/",
		required:[true, 'Password required']
	},
	email: { type: String, unique: true },
	name: String,
	mobile: Number,
	material: String,
	weight:{ Number, min:[0,'Enter Valid Weight']},
	quantity: { Number, min:[0,'Enter Valid quantity']},
	state: String,
	city: String,
	booked: [[mongoose.Types.ObjectId, String, String]], // [driverId,from,To]
	otp: { type: Number, index: { expires: "5m" } },
});

module.exports = mongoose.model("dealer", Dealer);
