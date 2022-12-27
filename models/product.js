var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  _id: {type: String, required: false},
    firstName: {type: String,required: true},
      lastName: {type: String,required: true},
      password: {type: String,required: true},
      role: {type: String,required: true},
      username: {type: String,required: true},
      id: {type: String, required: true},
      numberOfdays: {type: Number, required: false},
      timeoffRequest: {type: Array, required: false},
      approvedList: {type: Array, required: false}
});


// Export the model
module.exports = mongoose.model('Product', ProductSchema);