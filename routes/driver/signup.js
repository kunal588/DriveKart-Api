var express = require("express");
const router = express.Router();
const { Driver } = require("../../schema/driver");
const validator = require("validator");
router.post("/signup", (req, res) => {
	const new_driver = new Driver({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		mobile: req.body.mobile,
		age: req.body.age,
		truckNum: req.body.truckNum,
		capacity: req.body.capacity,
		transporterName: req.body.transporterName,
		experience: req.body.experience,
		book: [],
	});
	// Validation
	var error_json = {};
	const error = new_driver.validateSync();
	if (error) {
		if (error.errors["username"])
			error_json.username = error.errors["username"].message;
		if (error.errors["password"])
			error_json.password = error.errors["password"].message;
		if (error.errors["email"])
			error_json.email = error.errors["email"].message;
	}
	if (!validator.isNumeric(new_driver.age, { no_symbols: true }))
		error_json.age = "enter valid age";
	if (!validator.isNumeric(new_driver.capacity, { no_symbols: true }))
		error_json.capacity = "enter valid capacity";
	if (!validator.isNumeric(new_driver.experience, { no_symbols: true }))
		error_json.experience = "enter valid experience";

	if (Object.keys(error_json).length !== 0) {
		console.log("The data submitted on driver signup is not valid");
		res.status(400).send(error_json);
	} else {
		// Save the User
		new_driver.save(function (error) {
			if (error && error.code && error.code == 11000) {
				error_json[
					Object.keys(error.keyValue)
				] = `An account with that ${Object.keys(
					error.keyValue
				)} already exists.`;
				console.log("Driver Username alreadt exist");
				res.status(400).send(error_json);
			} else res.status(200).send("ok");
		});
	}
});

module.exports = router;
