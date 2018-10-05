var express = require('express');
var stellar = require('../controllers/stellar/createAccount');
var stellarBalance = require('../controllers/stellar/getBalance');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/createacc', stellar.createAccount);
router.get('/balance/:publicKey', stellarBalance.getBalance);

module.exports = router;
