var express = require('express');
var stellar = require('../controllers/stellar/createAccount');
var stellarBalance = require('../controllers/stellar/getBalance');
var router = express.Router();
var User = require('../models/user');

router.post('/signup', function(req, res, next){

    var user = new User({
      firstName: req.body.fname,
      lastName: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      publicKey: stellerPublicKey,
      creation_dt: Date.now()
    });
  
    let promise = user.save();
  
    promise.then(function(doc){
      return res.status(201).json(doc);
    })

    promise.catch(function(err){
      return res.status(501).json({message: 'Error registering user.'})
    })
  
  })




router.get('/createacc', stellar.createAccount);
router.get('/balance/:publicKey', stellarBalance.getBalance);

module.exports = router;
