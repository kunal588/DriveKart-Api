const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Driver = new Schema({
	username: {
		type: String,
		unique: true,
		required: [true, "Username required"],
	},
	password: {
		type: String,
		match: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/,
		required: [true, "Password required"],
	},
	email: {
		type: String,
		unique: true,
		validate: [validator.isEmail, "Enter a valid email address."],
	},
	name: String,
	age: String,
	mobile: String,
	truckNum: String,
	capacity: String,
	transporterName: String,
	experience: String,
	book: [mongoose.Types.ObjectId],
	otp: mongoose.Types.ObjectId,
});

Driver.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) {
			return next(null);
		}
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next(null);
	} catch (err) {
		console.log("Error occured while hashing the Password", err.message);
		next(err);
	}
});

Driver.methods.comparePassword = async function (passwd) {
	try {
		const res = await bcrypt.compare(passwd, this.password);
		return res;
	} catch (err) {
		console.log("Error occured while comparing Password", err.message);
		return false;
	}
};

Driver.methods.generateToken = function () {
	const token = jwt.sign({ sub: this.id }, process.env.JWT_SECRET, {
		issuer: "DriveKart",
		expiresIn: "1day",
	});
	return token;
};

Driver.methods.getUserData = function () {
	const obj = {
		name: this.name,
		age: this.age,
		mobile: this.mobile,
		truckNum: this.truckNum,
		capacity: this.capacity,
		transporterName: this.transporterName,
		experience: this.experience,
		book: this.book,
		id: this._id,
	};

	return obj;
};

const Route = new Schema({
	fromState: { type: String },
	fromCity: { type: String },
	toState: { type: String },
	toCity: { type: String },
	route: { type: String, unique: true },
	Drivers: [Driver],
});

Route.pre("save", function (next) {
	this.route = `${this.fromState},${this.fromCity} -> ${this.toState},${this.toCity}`;
	next(null);
});

module.exports.Driver = mongoose.model("driver", Driver);
module.exports.Route = mongoose.model("route", Route);
