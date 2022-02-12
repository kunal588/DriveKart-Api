const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const OTP = new Schema({
	otp: String,
	createdAt: { type: Date, expires: "5m", default: Date.now() },
});

// Hashing OTP So other's can't see the otp
OTP.pre("save", async function (next) {
	try {
		if (!this.isModified("otp")) {
			return next(null);
		}

		const salt = await bcrypt.genSalt(10);
		this.otp = await bcrypt.hash(this.otp, salt);
		next(null);
	} catch (err) {
		console.log("Error while hashing OTP", err.message);
		next(err);
	}
});

OTP.methods.compareOTP = async function (otp) {
	try {
		const res = await bcrypt.compare(otp, this.otp);
		return res;
	} catch (err) {
		console.log("Error occured while comparing the otp", err.message);
	}
};

// OTP.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

module.exports = mongoose.model("otp", OTP);
