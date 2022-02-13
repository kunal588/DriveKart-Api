const express = require("express");
const router = express.Router();
const { Auth } = require("../../middlewares/Authentication");
const { Dealer } = require("../../schema/dealer");
const { Driver } = require("../../schema/driver");

router.post("/", Auth, async (req, res) => {
	try {
		const dealerData = await Dealer.findById(req.body._id);
		res.status(200).json(dealerData.getUserData());
	} catch (err) {
		console.log(
			"Error occured while seacrhing for dealer Info,",
			err.message
		);
		res.status(503).send("Server Internal Error");
	}
});

router.post("/get/byId", Auth, async (req, res) => {
	try {
		const dealerData = await Dealer.findById(req.body.dealerId);
		res.status(200).json(dealerData.getUserData());
	} catch (err) {
		console.log(
			"Error occured while searching for a dealer Info",
			err.message
		);
		res.status(503).send("Server Internal Error");
	}
});

router.post("/bookDriver/byId", Auth, async (req, res) => {
	try {
		const { driverId, fromState, fromCity, toState, toCity } = req.body;
		await Dealer.findByIdAndUpdate(req.body._id, {
			$addToSet: {
				booked: {
					driverId: driverId,
					fromState,
					fromCity,
					toState,
					toCity,
				},
			},
		});

		await Driver.findByIdAndUpdate(driverId, {
			$addToSet: { book: req.body._id },
		});

		res.status(200).send("Booked Successfully");
	} catch (err) {
		console.log("Error occured while booking the dealer,", err.message);
		req.status(200).send("Server Internal Error");
	}
});

module.exports = router;
