// Login strategy
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
<<<<<<< HEAD
module.exports = function(User) {
    var loginStrategy = new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        User.findOne({
            where: {
                username: username
            }
        }).then(function(foundUser) {
            if (foundUser) { // User is found
                crypto.pbkdf2(password, foundUser.passwordHashSalt, 4096, 512, 'sha256', function(err, generatedHash) {
                    if (err) {
                        return done(err);
                    } // Error in generating has
                    if (generatedHash.toString('hex') == foundUser.passwordHash.toString('hex')) {
                        return done(null, foundUser);
                    } else {
                        req.flash('login-error', 'Oops! Wrong password.');
                        return done(null, false);
                    }
                });
            } else { // User is not found
                req.flash('login-error', 'Oops! This username isn\' registered.');
                return done(null, false);
            }
        }, function(err) {
            return done(err);
        })
    });
    return loginStrategy;
=======
module.exports = function (User) {
  var loginStrategy = new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
    User.findOne({where: {username: username}}).then(function (foundUser) {
      if (foundUser) {// User is found
        crypto.pbkdf2(password, foundUser.passwordHashSalt, 4096, 512, 'sha256', function (err, generatedHash) {
          if (err) {return done(err);}// Error in generating has
          if (generatedHash.toString('hex') == foundUser.passwordHash.toString('hex')) {return done(null, foundUser);} else {
            req.flash('login-error', 'Oops! Wrong password.');
            return done(null, false);
          }
        });
      } else {// User is not found
        req.flash('login-error', 'Oops! This username isn\' registered.');
        return done(null, false);
      }
    }, function (err) {return done(err);})
  });
  return loginStrategy;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
