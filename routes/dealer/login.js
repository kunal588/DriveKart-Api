const express = require("express");
const router = express.Router();
const { Dealer } = require("../../schema/dealer");
const otpGen = require("otp-generator");
const OTP = require("../../schema/otp");

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const driverData = await Dealer.findOne({ username });
		if (!driverData || !(await driverData.comparePassword(password))) {
			res.status(200).send("Either Username or Password is incorrect");
		} else {
			const token = driverData.generateToken();
			res.status(200).json({
				token,
				user: driverData.getUserData(),
			});
		}
	} catch (err) {
		console.log("Error occured while Login the user", err.message);
		res.status(503).send("Server Internal Error");
	}
});

router.post("/otp/generate", async (req, res) => {
	try {
		const { email } = req.body;

		const otp = otpGen.generate(6, {
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		});
		console.log("OTP", otp);
		const otp_doc = new OTP({ otp });
		await otp_doc.save();
		const result = await Dealer.findOneAndUpdate(
			{ email },
			{ otp: otp_doc.id }
		);
		res.send("OTP has been sent successfully");
	} catch (err) {
		console.log("Error occured while generating OTP", err.message);
		res.status(503).send("Server Internal Error");
	}
});

router.post("/otp/verify", async (req, res) => {
	try {
		const { email, otp } = req.body;
		console.log(email, otp);
		const dealer = await Dealer.findOne({ email: email });
		if (!dealer || !dealer.otp) {
			res.status(400).send(
				"User does not exist or he has not asked for otp before"
			);
			return;
		}
		console.log(dealer);
		const OTP_doc = await OTP.findById(dealer.otp);

		if (!OTP_doc) {
			res.status(203).send("Your OTP has expired");
		} else {
			if (OTP_doc.compareOTP(otp)) {
				const token = dealer.generateToken();
				res.status(200).json({
					token,
					user: dealer.getUserData(),
				});
			} else {
				res.status(203).send("Your OTP is incorrect");
			}
		}
	} catch (err) {
		console.log("Error occured while verifying the otp", err.message);
		res.status(503).send("Server Internal Error");
	}
});

module.exports = router;
