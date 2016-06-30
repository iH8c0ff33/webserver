// Model for Permission
module.exports = function(db, DataTypes) {
    var Permission = db.define('permissions', {
        permDescription: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Permission.sync();
    return Permission;
};
