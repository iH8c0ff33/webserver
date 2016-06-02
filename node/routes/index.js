// Router for path '/'
var router = require('express').Router();
module.exports = function (passport) {// Always send user to jade for navbar to work properly
  router.get('/', function (req, res) {res.render('index', {user: req.user});});
  router.get('/login', function (req, res) {res.render('login', {user: req.user, error: req.flash('login-error')});});
  router.get('/signup', function (req, res) {res.render('signup', {user: req.user, error: req.flash('signup-error')});});
  router.post('/login', function (req, res, next) {
    var error = false;
    if (!req.body.username) {req.flash('login-error', 'Sorry. Username can\'t be blank.'); error = true;}
    if (!req.body.password) {req.flash('login-error', 'Sorry. Password can\'t be blank.'); error = true;}
    if (error) {return res.redirect('/signup');}// Error empty fields
    passport.authenticate('local-login', function (err, user) {
      if (err) {req.flash('login-error', err); return res.redirect('/login');}// Error inside login strategy
      if (!user) {return res.redirect('/login');}// User not logged in
      req.login(user, function (err) {
        if (err) {return next(err);}
        return res.redirect('/');// User successfully logged in
      });
    })(req, res, next);
  });
  router.post('/signup', function (req, res, next) {
    var error = false;
    if (!req.body.username) {req.flash('signup-error', 'Sorry. Username can\'t be blank.'); error = true;}
    if (!req.body.username) {req.flash('signup-error', 'Sorry. First Name can\'t be blank.'); error = true;}
    if (!req.body.username) {req.flash('signup-error', 'Sorry. Last Name can\'t be blank'); error = true;}
    if (!req.body.email) {req.flash('signup-error', 'Sorry. Email can\'t be blank'); error = true;}
    if (!req.body.password) {req.flash('signup-error', 'Sorry. Password can\'t be blank.'); error = true;}
    if (req.body.username.match(/[^\w]/g)) {req.flash('signup-error', 'Sorry. Username must match [a-zA-Z0-9_]'); error = true;}
    if (error) {return res.redirect('/signup');}// Error empty fields
    passport.authenticate('local-signup', function(err, user) {
      if (err) {req.flash('signup-error', err); return res.redirect('/signup');}// Error inside login strategy
      if (!user) {return res.redirect('/signup');}// User not signed up
      req.login(user, function (err) {
        if (err) {return next(err);}
        return res.redirect('/');// User successfully signed up
      });
    })(req, res, next);
  });
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  return router;
};
