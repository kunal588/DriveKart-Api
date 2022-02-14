const express = require("express");
const router = express.Router();
const { Driver } = require("../../schema/driver");
const otpGen = require("otp-generator");
const OTP = require("../../schema/otp");
const nodemailer = require("nodemailer");

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const driverData = await Driver.findOne({ username });
		if (!driverData || !(await driverData.comparePassword(password))) {
			res.status(400).send("Either Username or Password is incorrect");
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
		const result = await Driver.findOneAndUpdate(
			{ email },
			{ otp: otp_doc.id }
		);

		// Sending mail
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.email,
				pass: process.env.pass,
			},
		});

		let mailOptions = {
			from: `Team DriveKart<${process.env.transporter}>`,
			to: `${email}`,
			subject: "OTP verification for DriverKart",
			html: `Your OTP for login is ${otp} .It would expire in 5 minutes. If you have not signed up for our service then this otp will not be valid`,
		};

		await transporter.sendMail(mailOptions);

		res.send("OTP has been sent successfully");
	} catch (err) {
		console.log("Error occured while generating OTP", err.message);
		res.status(503).send("Server Internal Error");
	}
});

router.post("/otp/verify", async (req, res) => {
	try {
		const { email, otp } = req.body;
		const driver = await Driver.findOne({ email: email });
		if (!driver || !driver.otp) {
			res.status(400).send(
				"User does not exist or he has not asked for otp before"
			);
			return;
		}

		const OTP_doc = await OTP.findById(driver.otp);

		if (!OTP_doc) {
			res.status(203).send("Your OTP has expired");
		} else {
			if (OTP_doc.compareOTP(otp)) {
				const token = driver.generateToken();
				res.status(200).json({
					token,
					user: driver.getUserData(),
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
