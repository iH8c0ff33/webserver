// Router for path '/manage'
var router = require('express').Router();
var Promise = require('sequelize').Promise;
module.exports = function (User, Group, Permission) {
  router.get('/', function (req, res) {
    User.findAll().then(function (foundUsers) {
      Group.findAll().then(function (foundGroups) {
        Permission.findAll().then(function (foundPerms) {
          res.render('manage/index', {
            user: req.user,
            users: foundUsers,
            groups: foundGroups,
            permissions: foundPerms,
            userMessage: req.flash('user-message'),
            userError: req.flash('user-error'),
            groupMessage: req.flash('group-message'),
            groupError: req.flash('group-error'),
            permError: req.flash('permission-error')
          });
        }, function (err) {return next(err);});
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
  router.get('/group/:groupName', function (req, res, next) {
    Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
      if (!foundGroup) {return res.send('not found');}
      Permission.findAll().then(function (foundPerms) {
        var permissions = foundPerms.map(function (item) {return item.permDescription;});
        foundGroup.getPermissions().then(function (groupPermissions) {
          var groupPerms = groupPermissions.map(function (item) {return item.permDescription;});
          foundGroup.getUsers().then(function (foundUsers) {
            var groupUsers = foundUsers.map(function (item) {return item.username;});
            return res.render('manage/group', {
              groupName: foundGroup.groupName,
              groupDescription: foundGroup.groupDescription,
              permissions: permissions,
              groupPermissions: groupPerms,
              groupUsers: groupUsers
            });
          }, function (err) {return next(err);});
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  })
  router.post('/group/:groupName', function (req, res, next) {
    if (req.query.new) {
      if (req.body.groupName.match(/[^\w]/g)) {
        req.flash('group-error', 'Group Name must match \\w');
        res.redirect('/manage#groups');
      }
      Group.find({where: {groupName: req.body.groupName}}).then(function (foundGroup) {
        if (foundGroup) {
          req.flash('group-error', 'Group '+req.body.groupName+' already exists');
          return res.redirect('/manage#groups');
        }
        Group.create({
          groupName: req.body.groupName,
          groupDescription: req.body.groupDescription
        }).then(function (createdGroup) {
          req.flash('group-message', 'Created group \''+createdGroup.groupName+'\'.');
          res.redirect('/manage#groups');
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    } else {
      Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
        var waitFor = [];
        if (!req.body.permissions) {
          foundGroup.update({
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription
          }).then(function (updatedGroup) {
            updatedGroup.setPermissions([]).then(function () {
              return res.redirect('/manage/group/'+updatedGroup.groupName);
            }, function (err) {return next(err);});
          }, function (err) {return next(err);});
        }
        if (typeof(req.body.permissions) == 'string') {var permissions = [req.body.permissions];} else {var permissions = req.body.permissions;}
        permissions.forEach(function (value) {waitFor.push(Permission.findOne({where: {permDescription: value}}));});
        Promise.all(waitFor).then(function (setPermissions) {
          foundGroup.update({
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription
          }).then(function (updatedGroup) {
            updatedGroup.setPermissions(setPermissions).then(function () {
              return res.redirect('/manage/group/'+updatedGroup.groupName);
            }, function (err) {return next(err);});
          }, function (err) {return next(err);});
        });
      }, function (err) {return next(err);});
    }
  });
  router.get('/group/:groupName/delete', function (req, res, next) {
    if (!req.query.redirectTo) {return res.send('Bad request');}
    Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
      if (!foundGroup) {
        req.flash('group-error', 'Group '+req.params.groupName+' not found');
        return res.redirect(req.query.redirectTo);
      }
      foundGroup.destroy().then(function () {
        req.flash('group-message', 'Group '+req.params.groupName+' deleted');
        return res.redirect(req.query.redirectTo);
      });
    }, function (err) {return next(err);})
  });
  router.post('/permission/:name', function (req, res, next) {
    Permission.find({where: {permDescription: req.body.permDescription}}).then(function (foundPerm) {
      if (foundPerm) {
        req.flash('permission-error', 'Permission '+req.body.permDescription+' already exists');
        return res.redirect('/manage#permissions');
      }
      Permission.create({permDescription: req.body.permDescription}).then(function (createdPerm) {
        return res.redirect('/manage#permissions');
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.get('/permission/:permDesc/delete', function (req, res, next) {
    if (!req.query.redirectTo) {return res.send('Bad request');}
    Permission.findOne({where: {permDescription: req.params.permDesc}}).then(function (foundPerm) {
      if (!foundPerm) {
        req.flash('permission-error', 'Permission '+req.params.permDesc+' not found');
        return res.redirect(req.query.redirectTo);
      }
      foundPerm.destroy().then(function () {
        return res.redirect(req.query.redirectTo);
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  return router;
};
