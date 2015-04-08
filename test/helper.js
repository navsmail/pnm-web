
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var async = require('async');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function () {
  for (var i in mongoose.connection.collections) {
    console.log('Removing collection: '+i);
    mongoose.connection.collections[i].remove(function() {});
  }
}
