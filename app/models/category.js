
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var config = require('config');

var imagerConfig = require(config.root + '/config/imager.js');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Center Schema
 */

var CategorySchema = new Schema({
  name: {type : String, default : '', trim : true},
  id: {type: String, default : '', trim : true},
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */


CategorySchema.path('name').required(true, 'Center name cannot be blank');
CategorySchema.path('id').required(true, 'Center id cannot be blank');

CategorySchema.methods = {


}