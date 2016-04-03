// Router for path '/manage'
var router = require('express').Router();
module.exports = function (User, Group, Permission) {
  router.get('/', function (req, res) {
    User.findAll().then(function (foundUsers) {
      Group.findAll().then(function (foundGroups) {
        res.render('manage/index', {
          user: req.user,
          users: foundUsers,
          groups: foundGroups,
          userMessage: req.flash('user-message'),
          userError: req.flash('user-error'),
          groupMessage: req.flash('group-message'),
          groupError: req.flash('group-error')
        });
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.get('/user/:username/delete', function (req, res, next) {
    if (!req.query.redirectTo) {return res.send('Bad request');}
    User.findOne({where: {username: req.params.username}}).then(function (foundUser) {
      if (!foundUser) {
        req.flash('user-error', 'User '+req.params.username+' not found');
        return res.redirect(req.query.redirectTo);
      }
      foundUser.destroy().then(function () {
        req.flash('user-message', 'User '+req.params.username+' deleted');
        return res.redirect(req.query.redirectTo);
      });
    }, function (err) {return next(err);})
  });
  router.post('/group/:name', function (req, res, next) {
    if (req.query.new) {
      if (req.body.groupName.match(/[^\w]/g)) {
        req.flash('group-error', 'Group Name must match \\w');
        res.redirect('/manage#groups');
      }
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
