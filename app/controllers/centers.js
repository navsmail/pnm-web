
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Center = mongoose.model('Center')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Center.load(id, function (err, center) {
    if (err) return next(err);
    if (!center) return next(new Error('not found'));
    req.center = center;
    next();
  });
};

/**
 * List
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Center.list(options, function (err, centers) {
    if (err) return res.render('500');
    Center.count().exec(function (err, count) {
      res.render('centers/index', {
        title: 'Centers',
        centers: centers,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New center
 */

exports.new = function (req, res){
  res.render('centers/new', {
    title: 'New Center',
    center: new Center({})
  });
};

/**
 * Create an center
 * Upload an image
 */

exports.create = function (req, res) {
  var center = new Center(req.body);
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  center.user = req.user;
  center.uploadAndSave(images, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created center!');
      return res.redirect('/centers/'+center._id);
    }
    // console.log(err);
    res.render('centers/new', {
      title: 'New Center',
      center: center,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an center
 */

exports.edit = function (req, res) {
  res.render('centers/edit', {
    title: 'Edit ' + req.center.title,
    center: req.center
  });
};

/**
 * Update center
 */

exports.update = function (req, res){
  var center = req.center;
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  // make sure no one changes the user
  delete req.body.user;
  center = extend(center, req.body);

  center.uploadAndSave(images, function (err) {
    if (!err) {
      return res.redirect('/centers/' + center._id);
    }

    res.render('centers/edit', {
      title: 'Edit Center',
      center: center,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('centers/show', {
    title: req.center.title,
    center: req.center
  });
};

/**
 * Delete an center
 */

exports.destroy = function (req, res){
  var center = req.center;
  center.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/centers');
  });
};
