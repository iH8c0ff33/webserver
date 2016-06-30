// Model for User Group
<<<<<<< HEAD
module.exports = function(db, DataTypes) {
    var Group = db.define('groups', {
        groupName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        groupDescription: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Group.sync();
    return Group;
=======
module.exports = function (db, DataTypes) {
  var Group = db.define('groups', {
    groupName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    groupDescription: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Group.sync();
  return Group;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
