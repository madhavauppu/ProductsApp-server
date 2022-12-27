var Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//Simple version, without validation or sanitation
exports.test = function (req, res) {
	res.send('Greetings from the Test controller!');
};

//User Registration
exports.product_create = function (req, res, next) {
	Product.count({}, function (err, count) {
		if (count) {
			Product.findOne({ username: req.body.username }, function (err, result) {
				if (err) return next(err);
				if (result && result.username == req.body.username) {
					return res.status(409).send({ status: 409, message: 'Username "' + result.username + '" is already taken' });
				}
			});
		}
		count = count ? count + 1 : 1;
		bcrypt.hash(req.body.password, 7, (err, encrypted) => {
			var product = new Product(
				{
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					password: encrypted,
					role: req.body.role,
					username: req.body.username,
					_id: count.toString(),
					id: count.toString()
				}
			);
			console.log(req.body);
			product.save(function (err) {
				if (err) {
					return next(err);
				}
				res.send({ message: 'Product Created successfully' });
			})
		})

	});
};

//Get specific user details
exports.product_details = function (req, res, next) {
	Product.findOne({ username: req.params.username }, function (err, product) {
		if (err) return next(err);
		res.send(product);
	})
};

//User login
exports.login = async (req, res, next) => {
	const user = await Product.findOne({ username: req.body.username });
	if (!user) {
		res.status(404).send({ error: "User not found" });
		return;
	}
	if (!(await bcrypt.compare(req.body.password, user.password))) {
		res.status(404).json({ error: "User not found" });
		return;
	}
	const token = await jwt.sign({ user }, "fake-jwt-secret", { expiresIn: '10s' });
	const { username, firstName, lastName, id, password, role, approvedList, timeoffRequest } = user;
	res.send({ username, firstName, lastName, id, password, role, approvedList, timeoffRequest, token });
};

//Get All users
exports.usersList = ('/usersList', (req, res) => {
	Product.find({}, function (err, result) {
		if (err) return next(err);
		res.send(result);
	});
});

//Update perticular user
exports.product_update = function (req, res, next) {
	Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
		console.log('after update ', product);
		if (err) return next(err);
		res.send({ message: 'Product udpated.' });
	});
};

//Delete specific user
exports.product_delete = function (req, res, next) {
	Product.findByIdAndRemove(req.params.id, function (err) {
		if (err) return next(err);
		res.send('Deleted successfully!');
	})
};