const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

driver.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) {
			return next(null);
		}
		const salt = await bcrypt.genSalt(10);
		this.password = bcrypt.hash(this.password, salt);
		next(null);
	} catch (err) {
		console.log("Error occured while hashing the Password", err.message);
		next(err);
	}
});

driver.methods.comparePassword = async function (passwd) {
	try {
		const res = await bcrypt.compare(passwd, this.password);
		return res;
	} catch (err) {
		console.log("Error occured while comparing Password", err.message);
		return false;
	}
};

driver.methods.generateToken = function () {
	const token = jwt.sign({ sub: this.id }, process.env.JWT_SECRET, {
		issuer: "DriveKart",
		expiresIn: "1day",
	});
	return token;
};

driver.methods.getuserData = function () {
	const obj = {
		name: this.name,
		age: this.age,
		mobile: this.mobile,
		truckNum: this.truckNum,
		capacity: this.capacity,
		transporterName: this.transporterName,
		experience: this.experience,
		book: this.book,
	};

	return obj;
};

const Route = new Schema({
	from: { type: String, unique: true },
	to: { type: String, unique: true },
	drivers: [driver],
});

module.exports.Driver = mongoose.model("Driver", driver);
module.exports.Route = mongoose.model("route", Route);
