// Router for path '/manage'
var router = require('express').Router();
module.exports = function (User, Group, Permission) {
  router.get('/', function (req, res) {
    User.findAll().then(function (foundUsers) {
      Group.findAll().then(function (foundGroups) {
        res.render('manage/index', {user: req.user, users: foundUsers, groups: foundGroups});
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  return router;
};
