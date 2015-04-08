var utils = require('../../lib/utils')
var extend = require('util')._extend


/**
 * List
 */

exports.index = function (req, res){
  res.render('main/index', {
    // title: 'Hello World'
  });
};