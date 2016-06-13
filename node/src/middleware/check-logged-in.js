module.exports = function(req, res, next) {
  if (!req.user) {return res.send('unauthenticated');}
  return next();  
};