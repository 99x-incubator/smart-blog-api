var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/signup', function(req, res, next){
  var user = new User({
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    publicKey: req.body.publickey,
    creation_dt: Date.now()
  });

  let promise = user.save();

  promise.then(function(doc){
    return res.status(201).json(doc);
  })

  promise.catch(function(err){
    return res.status(501).json({message: 'Error registering user.'})
  })

});

module.exports = router;
