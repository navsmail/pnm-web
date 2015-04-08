
/*!
 * Module dependencies.
 */

// Note: We can require users, centers and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var main = require('main');
var users = require('users');
var centers = require('centers');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var centerAuth = [auth.requiresLogin, auth.center.hasAuthorization];
// var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.get('/users/:userId', users.show);

  //  login locally --------------------------------
    app.post('/users/session',
      passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
      }), users.session);

  // login with google -----------------------------
    app.get('/auth/google',
      passport.authenticate('google', {
        failureRedirect: '/login',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      }), users.signin);
    app.get('/auth/google/callback',
      passport.authenticate('google', {
        failureRedirect: '/login'
      }), users.authCallback);

  app.param('userId', users.load);

  // center routes
  app.param('id', centers.load);
  app.get('/centers', centers.index);
  app.post('/centers', auth.requiresLogin, centers.create);
  app.get('/centers/new', auth.requiresLogin, centers.new);
  app.get('/centers/:id', centers.show);
  app.put('/centers/:id', centerAuth, centers.update);
  app.get('/centers/:id/edit', centerAuth, centers.edit);
  app.delete('/centers/:id', centerAuth, centers.destroy);

  // home route
  app.get('/', main.index);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}
