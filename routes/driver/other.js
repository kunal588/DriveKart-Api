var express = require("express");
const router = express.Router();
const { Driver } = require("../../schema/driver");
const { Route } = require("../../schema/driver");
const { Auth } = require("../../middlewares/Authentication");

router.post("/", Auth, (req, res) => {
  Driver.findById(req.body._id, (err, data) => {
    if (err) {
      console.log("Server error in route/driver/");
      res.status(503).send("Server Error");
    } else {
      res.json(data);
    }
  });
});

router.post("/get/byId", Auth, (req, res) => {
  Driver.findById(req.body.driverId, (err, data) => {
    if (err) {
      console.log("Server error in route/driver/get/byId");
      res.status(503).send("Server Error");
    } else {
      res.json(data);
    }
  });
});
router.post("/byRoute", Auth, (req, res) => {
  Route.find(
    {
      fromState: req.body.fromState,
      fromCity: req.body.fromCity,
      toState: req.body.toState,
      toCity: req.body.toCity,
    },
    (err, data) => {
      if (err) {
        console.log("Server error in route/driver/byRoute");
        res.status(503).send("Server Error");
      } else {
        res.json(data);
      }
    }
  );
});

router.post("/byAddress", Auth, (req, res) => {
  Route.find(
    {
      $or: [
        { fromState: req.body.state, fromCity: req.body.city },
        { toState: req.body.state, toCity: req.body.city },
      ],
    },
    (err, data) => {
      if (err) {
        console.log("Server error in route/driver/byAddress");
        res.status(503).send("Server Error");
      } else {
        const drivers = [];
        for (const route of data) {
          for (const driver of route.Drivers) {
            drivers.push(driver);
          }
        }
        res.json(drivers);
      }
    }
  );
});

module.exports = router;
