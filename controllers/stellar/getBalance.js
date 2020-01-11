var StellarSdk = require("stellar-sdk");
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
exports.getBalance = function(req, res, next) {
  var publicKey = req.params.publicKey;

  var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
  var arr = [];
  // the JS SDK uses promises for most actions, such as retrieving an account
  server.loadAccount(publicKey).then(function(account) {
    console.log("Balances for account: " + publicKey);
    account.balances.forEach(function(balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      arr.push({
        Type: balance.asset_type,
        Balance: balance.balance
      });
    });
    console.log(arr);
    res.send({
      publicKey: publicKey,
      assets: arr
    });
  });
};
