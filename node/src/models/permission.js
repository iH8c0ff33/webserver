// Model for Permission
<<<<<<< HEAD
module.exports = function(db, DataTypes) {
    var Permission = db.define('permissions', {
        permDescription: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Permission.sync();
    return Permission;
=======
module.exports = function (db, DataTypes) {
  var Permission = db.define('permissions', {
    permDescription: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Permission.sync();
  return Permission;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
