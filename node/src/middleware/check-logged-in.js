module.exports = function(req, res, next) {
<<<<<<< HEAD
    if (!req.user) {
        return res.send('unauthenticated');
    }
    return next();
};
=======
  if (!req.user) {return res.send('unauthenticated');}
  return next();  
};
>>>>>>> b7f1cd8cfd2e050f01f341f5b9eb91591821da7b
