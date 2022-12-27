var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth");
// Require the controllers WHICH WE DID NOT CREATE YET!!
var product_controller = require('../controllers/product');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);

router.post('/login', product_controller.login);

router.post('/create', product_controller.product_create);

router.use(auth).get('/usersList', product_controller.usersList);

router.use(auth).get('/:id', product_controller.product_details);

router.use(auth).put('/:id/update', product_controller.product_update);

router.use(auth).delete('/:id/delete', product_controller.product_delete);


module.exports = router;