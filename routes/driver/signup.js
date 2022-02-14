var express = require("express");
const router = express.Router();
const { Driver } = require("../../schema/driver");
const validator = require("validator");
const { Route } = require("../../schema/driver");

const addRoutes = async (fromState, fromCity, toState, toCity, new_driver) => {
  try {
    if (!fromState || !fromCity || !toState || !toCity) {
      throw new Error("Please Provide all the three routes");
    }
    await Route.findOneAndUpdate(
      {
        fromState: fromState,
        fromCity: fromCity,
        toState: toState,
        toCity: toCity,
      },
      { $addToSet: { Drivers: new_driver } },
      { upsert: true }
    );
  } catch (err) {
    console.log("Error occured while saving routes,", err.message);
  }
};

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
  const match_phoneNo = /^\d{10}$/;
  const error = new_driver.validateSync();
  if (error) {
    if (error.errors["username"])
      error_json.username = error.errors["username"].message;
    if (error.errors["password"])
      error_json.password = error.errors["password"].message;
    if (error.errors["email"]) error_json.email = error.errors["email"].message;
  }
  if (!new_driver.mobile.match(match_phoneNo))
    error_json.mobile = "Enter valid Phone Number";
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
        console.log("Driver Username already exist");
        res.status(400).send(error_json);
      } else {
        try {
          const {
            route1FromState,
            route1toState,
            route1FromCity,
            route1toCity,
            route2FromState,
            route2toState,
            route2FromCity,
            route2toCity,
            route3FromState,
            route3toState,
            route3FromCity,
            route3toCity,
          } = req.body;
          addRoutes(
            route1FromState,
            route1FromCity,
            route1toState,
            route1toCity,
            new_driver
          );
          addRoutes(
            route2FromState,
            route2FromCity,
            route2toState,
            route2toCity,
            new_driver
          );
          addRoutes(
            route3FromState,
            route3FromCity,
            route3toState,
            route3toCity,
            new_driver
          );
          res.status(200).send("driver added successfully");
        } catch (err) {
          console.log(
            "Error occured while adding routes for the driver,",
            err.message
          );
          res
            .status(503)
            .send(
              "Please contact the tech team as there was some prorblem while adding your routes"
            );
        }
      }
    });
  }
});

module.exports = router;
