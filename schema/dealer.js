const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const Booking = new Schema(
	{
		driverId: { type: mongoose.Types.ObjectId, required: true },
		fromState: { type: String, required: true },
		fromCity: { type: String, required: true },
		toState: { type: String, required: true },
		toCity: { type: String, required: true },
	},
	{ _id: false }
);

const Dealer = new Schema({
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
	mobile: Number,
	material: String,
	weight: String,
	quantity: String,
	state: String,
	city: String,
	booked: [Booking], // [driverId,from,To]
	otp: mongoose.Types.ObjectId,
});

Dealer.pre("save", async function (next) {
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

Dealer.methods.comparePassword = async function (passwd) {
	try {
		const res = await bcrypt.compare(passwd, this.password);
		return res;
	} catch (err) {
		console.log("Error occured while comparing Password", err.message);
		return false;
	}
};

Dealer.methods.generateToken = function () {
	const token = jwt.sign({ sub: this.id }, process.env.JWT_SECRET, {
		issuer: "DriveKart",
		expiresIn: "1day",
	});
	return token;
};

Dealer.methods.getUserData = function () {
	const obj = {
		name: this.name,
		mobile: this.mobile,
		material: this.material,
		weight: this.weight,
		quantity: this.quantity,
		state: this.state,
		city: this.city,
		booked: this.booked,
	};

	return obj;
};

module.exports.Dealer = mongoose.model("dealer", Dealer);
