const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
	try {
		if (!req.body.token) {
			res.status(401).send("Unauthorised");
			return;
		}
		const data = jwt.verify(req.body.token, process.env.JWT_SECRET);
		req.body._id = data.sub;
		next();
	} catch (err) {
		console.log("The JWT has expired", err.message);
		res.status(401).send("Unauthorised");
	}
};

module.exports = { Auth };
