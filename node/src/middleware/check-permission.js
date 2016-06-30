var Promise = require('sequelize').Promise;
<<<<<<< HEAD
module.exports = function(User) {
    return function(permissions) {
        return function(req, res, next) {
            User.findOne({
                where: {
                    username: req.user.username
                }
            }).then(function(user) {
                Promise.all([
                    user.getPermissions(),
                    user.getGroups()
                ]).then(function(data) {
                    var findUserGroupsPermissions = [];
                    data[1].forEach(function(group) {
                        findUserGroupsPermissions.push(group.getPermissions());
                    });
                    Promise.all(findUserGroupsPermissions).then(function(found) {
                        var userPermissions = data[0].map(function(item) {
                            return item.permDescription;
                        });
                        var userGroupsPermissions = [].concat.apply([], found).map(function(item) {
                            return item.permDescription;
                        });
                        permissions.forEach(function(check) {
                            if (userPermissions.indexOf(check) < 0 && userGroupsPermissions.indexOf(check) < 0) {
                                return res.send('not authorized');
                            }
                            return next();
                        });
                    }, function(err) {
                        return next(err);
                    });
                }, function(err) {
                    return next(err);
                });
            }, function(err) {
                return next(err);
            });
        };
    };
=======
module.exports = function (User) {
  return function (permissions) {
    return function (req, res, next) {
      User.findOne({where: {username: req.user.username}}).then(function (user) {
        Promise.all([
          user.getPermissions(),
          user.getGroups()
        ]).then(function (data) {
          var findUserGroupsPermissions = [];
          data[1].forEach(function (group) {findUserGroupsPermissions.push(group.getPermissions());});
          Promise.all(findUserGroupsPermissions).then(function (found) {
            var userPermissions = data[0].map(function (item) {return item.permDescription;});
            var userGroupsPermissions = [].concat.apply([], found).map(function (item) {return item.permDescription;});
            permissions.forEach(function (check) {
              if (userPermissions.indexOf(check) < 0 && userGroupsPermissions.indexOf(check) < 0) {
                return res.send('not authorized');
              }
              return next();
            });
          }, function (err) {return next(err);});
        }, function (err) {return next(err);});
      }, function (err) {return next(err);});
    };
  };
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
