const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driver = new Schema({
	username: { type: String, unique: true },
	password: {
		type: String,
		match: "/^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/",
	},
	email: { type: String, unique: true },
	name: String,
	age: Number,
	mobile: Number,
	truckNum: String,
	capacity: Number,
	transporterName: String,
	experience: Number,
	book: [mongoose.Types.ObjectId],
	otp: mongoose.Types.ObjectId,
});

const Route = new Schema({
	from: { type: String, unique: true },
	to: { type: String, unique: true },
	drivers: [driver],
});

module.exports.Driver = mongoose.model("Driver", driver);
module.exports.Route = mongoose.model("route", Route);
