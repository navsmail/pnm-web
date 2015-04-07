
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}

/*
 *  Article authorization routing middleware
 */

exports.center = {
  hasAuthorization: function (req, res, next) {
    if (req.center.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/centers/' + req.center.id)
    }
    next()
  }
}

