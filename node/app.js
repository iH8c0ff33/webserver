'use strict';
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var flash = require('express-flash');
var passport = require('passport');
var favicon = require('serve-favicon');
var app = express();
app.use(favicon(__dirname+'/public/favicon.ico'));
app.locals.basedir = __dirname+'/views';
// Postgres connection
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://www@www_db:5432/webserver');
var sessionStore = new SequelizeStore({db: db});
sessionStore.sync();
// Models
var User = db.import(__dirname+'/models/user.js');
var Group = db.import(__dirname+'/models/group.js');
var Permission = db.import(__dirname+'/models/permission.js');
User.belongsToMany(Group, {through: 'UserGroup'});
Group.belongsToMany(User, {through: 'UserGroup'});
Group.belongsToMany(Permission, {through: 'GroupPermission'});
Permission.belongsToMany(Group, {through: 'GroupPermission'});
User.belongsToMany(Permission, {through: 'UserPermission'});
Permission.belongsToMany(User, {through: 'UserPermission'});
db.sync();
// Express configuration
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.enable('trust proxy');
// Passport configuration
app.use(session(require(__dirname+'/config/session.js')(sessionStore)));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use('local-signup', require(__dirname+'/strategies/local-signup.js')(User));
passport.use('local-login', require(__dirname+'/strategies/local-login.js')(User));
passport.serializeUser(require(__dirname+'/strategies/serializeUser.js'));
passport.deserializeUser(require(__dirname+'/strategies/deserializeUser.js')(User));
// Routes
app.use('/', require(__dirname+'/routes/index.js')(passport));
app.use('/manage', require(__dirname+'/routes/manage.js')(User, Group, Permission));
// Espress server
app.listen(2765);
