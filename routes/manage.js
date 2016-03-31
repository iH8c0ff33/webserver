// Router for path '/manage'
var router = require('express').Router();
router.get('/users', function (req, res) {res.render('manage/users', {user: req.user});});
module.exports = router;
