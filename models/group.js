// Model for User Group
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
}
