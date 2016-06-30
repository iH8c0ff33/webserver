// Model for User
<<<<<<< HEAD
module.exports = function(db, DataTypes) {
    var User = db.define('users', {
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        passwordHashSalt: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    });
    User.sync();
    return User;
=======
module.exports =  function (db, DataTypes) {
  var User = db.define('users', {
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    passwordHashSalt: {
      type: DataTypes.BLOB,
      allowNull: false
    }
  });
  User.sync();
  return User;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
};
