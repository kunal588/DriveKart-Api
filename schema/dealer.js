const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Dealer = new Schema({
	username: { type: String, unique: true },
	password: {
		type: String,
		match: "/^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/",
	},
	email: { type: String, unique: true },
	name: String,
	mobile: Number,
	material: String,
	weight: Number,
	quantity: String,
	state: String,
	city: String,
	booked: [[mongoose.Types.ObjectId, String, String]], // [driverId,from,To]
	otp: { type: Number, index: { expires: "5m" } },
});

module.exports = mongoose.model("dealer", Dealer);
