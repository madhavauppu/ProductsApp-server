var Product = require('../models/product');
const bcrypt = require('bcrypt');
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res, next) {
    Product.count({}, function( err, count){
        if(count) {
            Product.findOne({username: req.body.username}, function (err, result) { 
                if (err) return next(err);
                if (result && result.username==req.body.username){ 
                  return res.status(409).send({ status: 409, message: 'Username "' + result.username + '" is already taken'});
                }
          });
        } 
        count = count ? count + 1 : 1;
        bcrypt.hash(req.body.password, 7, (err, encrypted) => {
            var product = new Product(
                {
                    firstName: req.body.firstName,
                    lastName:  req.body.lastName,
                    password:  encrypted,
                    role:  req.body.role,
                    username:  req.body.username,
                    _id: count.toString(),
                    id: count.toString()
                }
            );
            console.log(req.body);
            product.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send({message: 'Product Created successfully'});
            })
            })
       
    });

 
 
};

exports.product_details = function (req, res, next) {
    Product.findOne({username: req.params.username}, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
};
exports.login = function (req, res, next) {
    Product.findOne({username: req.body.username}, function (err, user) {
        if (err) return next(err);
        if (user) {
            //----compare passwords-----//
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true) {
             res.send(user);
                } else {
                    res.status(401).send({ status: 401, message: 'Incorrect password'});
                // redirect to login page
                }
                })
       
      //---end checking password compraison
        } else {
            return res.status(404).send({ status: 404, message: 'Username not found'});
        }
    })
};
exports.usersList = ('/usersList', (req, res) => {
    Product.find({}, function (err, result)  {
        if (err) return next(err);
       res.send(result);
    });
});

exports.product_update = function (req, res, next) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        console.log('after update ', product);
        if (err) return next(err);
        res.send({message: 'Product udpated.'});
    });
};

exports.product_delete = function (req, res, next) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};