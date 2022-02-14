var express = require("express");
const router = express.Router();
const { Dealer } = require("../../schema/dealer");
const validator = require("validator");

router.post("/signup", (req, res) => {
  const new_dealer = new Dealer({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    mobile: req.body.mobile,
    material: req.body.material,
    weight: req.body.weight,
    quantity: req.body.quantity,
    state: req.body.state,
    city: req.body.city,
    booked: [],
  });
  var error_json = {};
  const match_phoneNo = /^\d{10}$/;
  error = new_dealer.validateSync();
  if (error) {
    if (error.errors["username"])
      error_json.username = error.errors["username"].message;
    if (error.errors["password"])
      error_json.password = error.errors["password"].message;
    if (error.errors["email"]) error_json.email = error.errors["email"].message;
  }
  if (!new_dealer.mobile.match(match_phoneNo))
    error_json.mobile = "Enter valid Phone Number";
  if (!validator.isNumeric(new_dealer.weight, { no_symbols: true }))
    error_json.weight = "Enter valid Weight";
  if (!validator.isNumeric(new_dealer.quantity, { no_symbols: true }))
    error_json.quantity = "Enter valid Quantity";
  if (Object.keys(error_json).length !== 0) {
    res.status(400).send(error_json);
  } else {
    new_dealer.save(function (error) {
      if (error && error.code && error.code == 11000) {
        error_json[
          Object.keys(error.keyValue)
        ] = `An account with that ${Object.keys(
          error.keyValue
        )} already exists.`;
        res.status(400).send(error_json);
      } else res.status(200).send("ok");
    });
  }
});

module.exports = router;
