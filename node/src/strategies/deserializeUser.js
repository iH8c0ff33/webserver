// Executed at every request to insert user object inside req variable
<<<<<<< HEAD
module.exports = function(User) {
    var deserialize = function(id, done) {
        User.findById(id).then(function(foundUser) {
            return done(null, foundUser);
        }, function(err) {
            return done(err);
        })
    };
    return deserialize;
=======
module.exports = function (User) {
  var deserialize = function (id, done) {
    User.findById(id).then(function (foundUser) {
      return done(null, foundUser);
    }, function (err) {return done(err);})
  };
  return deserialize;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
}
