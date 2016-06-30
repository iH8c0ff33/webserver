// Router for path '/manage'
var router = require('express').Router();
var Promise = require('sequelize').Promise;
<<<<<<< HEAD
module.exports = function(User, Group, Permission) {
    var checkPermissions = require(__dirname + '/../middleware/check-permission.js')(User);
    var checkLoggedIn = require(__dirname + '/../middleware/check-logged-in.js');
    router.get('/', checkLoggedIn, checkPermissions(['manage']), function(req, res, next) {
        Promise.all([
            User.findAll(),
            Group.findAll(),
            Permission.findAll()
        ]).then(function(data) {
            res.render('manage/index', {
                user: req.user,
                users: data[0],
                groups: data[1],
                permissions: data[2],
                userError: req.flash('user-error'),
                groupError: req.flash('group-error'),
                permError: req.flash('permission-error')
            });
        }, function(err) {
            return next(err);
        });
    });
    router.get('/user/:username', checkLoggedIn, function(req, res, next) {
        User.findOne({
            where: {
                username: req.params.username
            }
        }).then(function(foundUser) {
            if (!foundUser) {
                return res.send('not found');
            }
            Promise.all([
                Group.findAll(),
                foundUser.getGroups(),
                Permission.findAll(),
                foundUser.getPermissions()
            ]).then(function(data) {
                var findUserGroupsPermissions = [];
                data[1].forEach(function(group) {
                    findUserGroupsPermissions.push(group.getPermissions());
                });
                Promise.all(findUserGroupsPermissions).then(function(found) {
                    var groups = data[0].map(function(item) {
                        return item.groupName;
                    });
                    var userGroups = data[1].map(function(item) {
                        return item.groupName;
                    });
                    var permissions = data[2].map(function(item) {
                        return item.permDescription;
                    });
                    var userPermissions = data[3].map(function(item) {
                        return item.permDescription;
                    });
                    var userGroupsPermissions = [].concat.apply([], found).map(function(item) {
                        return item.permDescription;
                    });
                    return res.render('manage/user', {
                        user: req.user,
                        username: foundUser.username,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email: foundUser.email,
                        groups: groups,
                        userGroups: userGroups,
                        permissions: permissions,
                        userPermissions: userPermissions,
                        userGroupsPermissions: userGroupsPermissions
                    });
                });
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.post('/user/:username', checkLoggedIn, function(req, res, next) {
        User.findOne({
            where: {
                username: req.params.username
            }
        }).then(function(foundUser) {
            if (!foundUser) {
                return res.send('user does not exist');
            }
            var updates = [];
            // groups
            if (!req.body.groups) {
                updates.push(foundUser.setGroups([]));
            } else {
                var updateGroups = [];
                if (typeof(req.body.groups) == 'string') {
                    var groups = [req.body.groups];
                } else {
                    groups = req.body.groups;
                }
                groups.forEach(function(group) {
                    updateGroups.push(Group.findOne({
                        where: {
                            groupName: group
                        }
                    }));
                });
                updates.push(Promise.all(updateGroups).then(function(groupsToUpdate) {
                    return foundUser.setGroups(groupsToUpdate);
                }));
            }
            // permissions
            if (!req.body.permissions) {
                updates.push(foundUser.setPermissions([]));
            } else {
                var updatePermissions = [];
                if (typeof(req.body.permissions) == 'string') {
                    var permissions = [req.body.permissions];
                } else {
                    permissions = req.body.permissions;
                }
                permissions.forEach(function(permission) {
                    updatePermissions.push(Permission.findOne({
                        where: {
                            permDescription: permission
                        }
                    }));
                });
                updates.push(Promise.all(updatePermissions).then(function(permissionsToUpdate) {
                    return foundUser.setPermissions(permissionsToUpdate);
                }));
            }
            // user
            Promise.all(updates).then(function() {
                foundUser.update({
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email
                }).then(function(updatedUser) {
                    res.redirect('/manage/user/' + updatedUser.username);
                }, function(err) {
                    return next(err);
                });
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.get('/user/:username/delete', checkLoggedIn, function(req, res, next) {
        if (!req.query.redirectTo) {
            return res.send('Bad request');
        }
        User.findOne({
            where: {
                username: req.params.username
            }
        }).then(function(foundUser) {
            if (!foundUser) {
                req.flash('user-error', 'User ' + req.params.username + ' not found');
                return res.redirect(req.query.redirectTo);
            }
            foundUser.destroy().then(function() {
                req.flash('user-message', 'User ' + req.params.username + ' deleted');
                return res.redirect(req.query.redirectTo);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.get('/group/:groupName', checkLoggedIn, function(req, res, next) {
        Group.findOne({
            where: {
                groupName: req.params.groupName
            }
        }).then(function(foundGroup) {
            if (!foundGroup) {
                return res.send('not found');
            }
            var find = [
                Permission.findAll(),
                foundGroup.getPermissions(),
                User.findAll(),
                foundGroup.getUsers()
            ];
            Promise.all(find).then(function(data) {
                var permissions = data[0].map(function(item) {
                    return item.permDescription;
                });
                var groupPermissions = data[1].map(function(item) {
                    return item.permDescription;
                });
                var users = data[2].map(function(item) {
                    return item.username;
                });
                var groupUsers = data[3].map(function(item) {
                    return item.username;
                });
                return res.render('manage/group', {
                    user: req.user,
                    groupName: foundGroup.groupName,
                    groupDescription: foundGroup.groupDescription,
                    permissions: permissions,
                    groupPermissions: groupPermissions,
                    users: users,
                    groupUsers: groupUsers
                });
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.post('/group/:groupName', checkLoggedIn, function(req, res, next) {
        if (req.query.new) {
            if (req.body.groupName.match(/[^\w]/g)) {
                req.flash('group-error', 'Group Name must match \\w');
                res.redirect('/manage#groups');
            }
            Group.find({
                where: {
                    groupName: req.body.groupName
                }
            }).then(function(foundGroup) {
                if (foundGroup) {
                    req.flash('group-error', 'Group ' + req.body.groupName + ' already exists');
                    return res.redirect('/manage#groups');
                }
                Group.create({
                    groupName: req.body.groupName,
                    groupDescription: req.body.groupDescription
                }).then(function() {
                    res.redirect('/manage#groups');
                }, function(err) {
                    return next(err);
                });
            }, function(err) {
                return next(err);
            });
        } else {
            Group.findOne({
                where: {
                    groupName: req.params.groupName
                }
            }).then(function(foundGroup) {
                if (!foundGroup) {
                    return res.send('group does not exist');
                }
                var updates = [];
                // permissions
                if (!req.body.permissions) {
                    updates.push(foundGroup.setPermissions([]));
                } else {
                    var updatePermissions = [];
                    if (typeof(req.body.permissions) == 'string') {
                        var permissions = [req.body.permissions];
                    } else {
                        permissions = req.body.permissions;
                    }
                    permissions.forEach(function(permission) {
                        updatePermissions.push(Permission.findOne({
                            where: {
                                permDescription: permission
                            }
                        }));
                    });
                    updates.push(Promise.all(updatePermissions).then(function(permissionsToUpdate) {
                        return foundGroup.setPermissions(permissionsToUpdate);
                    }));
                }
                // users
                if (!req.body.users) {
                    updates.push(foundGroup.setUsers([]));
                } else {
                    var updateUsers = [];
                    if (typeof(req.body.users) == 'string') {
                        var users = [req.body.users];
                    } else {
                        users = req.body.users;
                    }
                    users.forEach(function(user) {
                        updateUsers.push(User.findOne({
                            where: {
                                username: user
                            }
                        }));
                    });
                    updates.push(Promise.all(updateUsers).then(function(usersToUpdate) {
                        return foundGroup.setUsers(usersToUpdate);
                    }));
                }
                // group
                Promise.all(updates).then(function() {
                    foundGroup.update({
                        groupName: req.body.groupName,
                        groupDescription: req.body.groupDescription
                    }).then(function(updatedGroup) {
                        return res.redirect('/manage/group/' + updatedGroup.groupName);
                    }, function(err) {
                        return next(err);
                    });
                }, function(err) {
                    return next(err);
                });
            }, function(err) {
                return next(err);
            });
        }
    });
    router.get('/group/:groupName/delete', checkLoggedIn, function(req, res, next) {
        if (!req.query.redirectTo) {
            return res.send('Bad request');
        }
        Group.findOne({
            where: {
                groupName: req.params.groupName
            }
        }).then(function(foundGroup) {
            if (!foundGroup) {
                req.flash('group-error', 'Group ' + req.params.groupName + ' not found');
                return res.redirect(req.query.redirectTo);
            }
            foundGroup.destroy().then(function() {
                return res.redirect(req.query.redirectTo);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.post('/permission/:name', checkLoggedIn, function(req, res, next) {
        Permission.find({
            where: {
                permDescription: req.body.permDescription
            }
        }).then(function(foundPerm) {
            if (foundPerm) {
                req.flash('permission-error', 'Permission ' + req.body.permDescription + ' already exists');
                return res.redirect('/manage#permissions');
            }
            Permission.create({
                permDescription: req.body.permDescription
            }).then(function() {
                return res.redirect('/manage#permissions');
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    });
    router.get('/permission/:permDesc/delete', checkLoggedIn, function(req, res, next) {
        if (!req.query.redirectTo) {
            return res.send('Bad request');
        }
        Permission.findOne({
            where: {
                permDescription: req.params.permDesc
            }
        }).then(function(foundPerm) {
            if (!foundPerm) {
                req.flash('permission-error', 'Permission ' + req.params.permDesc + ' not found');
                return res.redirect(req.query.redirectTo);
            }
            foundPerm.destroy().then(function() {
                return res.redirect(req.query.redirectTo);
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    });
    return router;
=======
module.exports = function (User, Group, Permission) {
  var checkPermissions = require(__dirname+'/../middleware/check-permission.js')(User);
  var checkLoggedIn = require(__dirname+'/../middleware/check-logged-in.js');
  router.get('/',checkLoggedIn , checkPermissions(['manage']) , function (req, res, next) {
    Promise.all([
      User.findAll(),
      Group.findAll(),
      Permission.findAll()
    ]).then(function (data) {
      res.render('manage/index', {
        user: req.user,
        users: data[0],
        groups: data[1],
        permissions: data[2],
        userError: req.flash('user-error'),
        groupError: req.flash('group-error'),
        permError: req.flash('permission-error')
      });
    }, function (err) {return next(err);});
  });
  router.get('/user/:username',checkLoggedIn , function (req, res, next) {
    User.findOne({where: {username: req.params.username}}).then(function (foundUser) {
      if (!foundUser) {return res.send('not found');}
      Promise.all([
        Group.findAll(),
        foundUser.getGroups(),
        Permission.findAll(),
        foundUser.getPermissions()
      ]).then(function (data) {
        var findUserGroupsPermissions = [];
        data[1].forEach(function (group) {findUserGroupsPermissions.push(group.getPermissions());});
        Promise.all(findUserGroupsPermissions).then(function (found) {
          var groups = data[0].map(function (item) {return item.groupName;});
          var userGroups = data[1].map(function (item) {return item.groupName;});
          var permissions = data[2].map(function (item) {return item.permDescription;});
          var userPermissions = data[3].map(function (item) {return item.permDescription;});
          var userGroupsPermissions = [].concat.apply([], found).map(function (item) {return item.permDescription;});
          return res.render('manage/user', {
            user: req.user,
            username: foundUser.username,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            groups: groups,
            userGroups: userGroups,
            permissions: permissions,
            userPermissions: userPermissions,
            userGroupsPermissions: userGroupsPermissions
          });
        });
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.post('/user/:username',checkLoggedIn , function (req, res, next) {
    User.findOne({where: {username: req.params.username}}).then(function (foundUser) {
      if (!foundUser) {return res.send('user does not exist');}
      var updates = [];
      // groups
      if (!req.body.groups) {updates.push(foundUser.setGroups([]));} else {
        var updateGroups = [];
        if (typeof(req.body.groups) == 'string') {var groups = [req.body.groups];} else {groups = req.body.groups;}
        groups.forEach(function (group) {updateGroups.push(Group.findOne({where: {groupName: group}}));});
        updates.push(Promise.all(updateGroups).then(function (groupsToUpdate) {return foundUser.setGroups(groupsToUpdate);}));
      }
      // permissions
      if (!req.body.permissions) {updates.push(foundUser.setPermissions([]));} else {
        var updatePermissions = [];
        if (typeof(req.body.permissions) == 'string') {var permissions = [req.body.permissions];} else {permissions = req.body.permissions;}
        permissions.forEach(function(permission) {updatePermissions.push(Permission.findOne({where: {permDescription: permission}}));});
        updates.push(Promise.all(updatePermissions).then(function (permissionsToUpdate) {return foundUser.setPermissions(permissionsToUpdate);}));
      }
      // user
      Promise.all(updates).then(function () {
        foundUser.update({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email
        }).then(function (updatedUser) {
          res.redirect('/manage/user/'+updatedUser.username);
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.get('/user/:username/delete',checkLoggedIn , function (req, res, next) {
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
    }, function (err) {return next(err);});
  });
  router.get('/group/:groupName',checkLoggedIn , function (req, res, next) {
    Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
      if (!foundGroup) {return res.send('not found');}
      var find = [
        Permission.findAll(),
        foundGroup.getPermissions(),
        User.findAll(),
        foundGroup.getUsers()
      ];
      Promise.all(find).then(function (data) {
        var permissions = data[0].map(function (item) {return item.permDescription;});
        var groupPermissions = data[1].map(function (item) {return item.permDescription;});
        var users = data[2].map(function (item) {return item.username;});
        var groupUsers = data[3].map(function (item) {return item.username;});
        return res.render('manage/group', {
          user: req.user,
          groupName: foundGroup.groupName,
          groupDescription: foundGroup.groupDescription,
          permissions: permissions,
          groupPermissions: groupPermissions,
          users: users,
          groupUsers: groupUsers
        });
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.post('/group/:groupName',checkLoggedIn , function (req, res, next) {
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
        }).then(function () {
          res.redirect('/manage#groups');
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    } else {
      Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
        if (!foundGroup) {return res.send('group does not exist');}
        var updates = [];
        // permissions
        if (!req.body.permissions) {updates.push(foundGroup.setPermissions([]));} else {
          var updatePermissions = [];
          if (typeof(req.body.permissions) == 'string') {var permissions = [req.body.permissions];} else {permissions = req.body.permissions;}
          permissions.forEach(function(permission) {updatePermissions.push(Permission.findOne({where: {permDescription: permission}}));});
          updates.push(Promise.all(updatePermissions).then(function (permissionsToUpdate) {return foundGroup.setPermissions(permissionsToUpdate);}));
        }
        // users
        if (!req.body.users) {updates.push(foundGroup.setUsers([]));} else {
          var updateUsers = [];
          if (typeof(req.body.users) == 'string') {var users = [req.body.users];} else {users = req.body.users;}
          users.forEach(function (user) {updateUsers.push(User.findOne({where: {username: user}}));});
          updates.push(Promise.all(updateUsers).then(function (usersToUpdate) {return foundGroup.setUsers(usersToUpdate);}));
        }
        // group
        Promise.all(updates).then(function () {
          foundGroup.update({
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription
          }).then(function (updatedGroup) {
            return res.redirect('/manage/group/'+updatedGroup.groupName);
          }, function (err) {return next(err);});
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    }
  });
  router.get('/group/:groupName/delete',checkLoggedIn , function (req, res, next) {
    if (!req.query.redirectTo) {return res.send('Bad request');}
    Group.findOne({where: {groupName: req.params.groupName}}).then(function (foundGroup) {
      if (!foundGroup) {
        req.flash('group-error', 'Group '+req.params.groupName+' not found');
        return res.redirect(req.query.redirectTo);
      }
      foundGroup.destroy().then(function () {
        return res.redirect(req.query.redirectTo);
      });
    }, function (err) {return next(err);});
  });
  router.post('/permission/:name',checkLoggedIn , function (req, res, next) {
    Permission.find({where: {permDescription: req.body.permDescription}}).then(function (foundPerm) {
      if (foundPerm) {
        req.flash('permission-error', 'Permission '+req.body.permDescription+' already exists');
        return res.redirect('/manage#permissions');
      }
      Permission.create({permDescription: req.body.permDescription}).then(function () {
        return res.redirect('/manage#permissions');
      }, function (err) {return next(err);});
    }, function (err) {return next(err);});
  });
  router.get('/permission/:permDesc/delete',checkLoggedIn , function (req, res, next) {
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
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
