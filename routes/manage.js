// Router for path '/manage'
var router = require('express').Router();
module.exports = function (User, Group, Permission) {
  router.get('/', function (req, res) {
    User.findAll().then(function (foundUsers) {
      Group.findAll().then(function (foundGroups) {
        res.render('manage/index', {user: req.user, users: foundUsers, groups: foundGroups, groupMessage: req.flash('group-message')});
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.post('/group/:name', function (req, res, next) {
    if (req.query.new) {
      Group.create({
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription
      }).then(function (createdGroup) {
        req.flash('group-message', 'Created group \''+createdGroup.groupName+'\'.');
        res.redirect('/manage#groups');
      }, function (err) {return next(err);});
    } else {return res.send('nonono')}
  });
  return router;
};
