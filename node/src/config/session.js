// Config file for 'express-session'
<<<<<<< HEAD
module.exports = function(sessionStore) {
    var sessionConfig = {
        secret: 'thisIsReallySecret', // This is the key used to encrypt cookies
        cookie: {
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        },
        resave: false, // Don't enable (will break with sequelize)
        saveUninitialized: true, // Need to be enabled to use flashes
        store: sessionStore,
        proxy: true
    }
    return sessionConfig;
=======
module.exports = function (sessionStore) {
  var sessionConfig = {
    secret: 'thisIsReallySecret',// This is the key used to encrypt cookies
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    },
    resave: false,// Don't enable (will break with sequelize)
    saveUninitialized: true,// Need to be enabled to use flashes
    store: sessionStore,
    proxy: true
  }
  return sessionConfig;
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
}
