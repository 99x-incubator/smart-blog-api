var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.createAccount = function(req, res, next){

    var pair = StellarSdk.Keypair.random();
    
    pair.secret();
    pair.publicKey();
    var request = require('request');
    request.get({
        url: 'https://friendbot.stellar.org',
        qs: { addr: pair.publicKey() },
        json: true
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error('ERROR!', error || body);
        }
        else {
            console.log('SUCCESS! You have a new account :)\n', body);
            // the JS SDK uses promises for most actions, such as retrieving an account
            server.loadAccount(pair.publicKey()).then(function (account) {
                console.log('Balances for account: ' + pair.publicKey());
                account.balances.forEach(function (balance) {
                    console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                });
            });
            // Keys for accounts to issue and receive the new asset
            var issuingKeys = StellarSdk.Keypair
                .fromSecret('SCKL62GED46Z6ZXN7IBPQX43KNSQOI62XD7DKNW4FDFYZQUPQZRTHFBV');
            var receivingKeys = pair;
            // Create an object to represent the new asset
            var Blog = new StellarSdk.Asset('Blog', issuingKeys.publicKey());
            // First, the receiving account must trust the asset
            server.loadAccount(receivingKeys.publicKey())
                .then(function (receiver) {
                    var transaction = new StellarSdk.TransactionBuilder(receiver)
                        // The `changeTrust` operation creates (or alters) a trustline
                        // The `limit` parameter below is optional
                        .addOperation(StellarSdk.Operation.changeTrust({
                            asset: Blog,
                            limit: '1000'
                        }))
                        .build();
                    transaction.sign(receivingKeys);
                    return server.submitTransaction(transaction);
                })
                // Second, the issuing account actually sends a payment using the asset
                .then(function () {
                    return server.loadAccount(issuingKeys.publicKey());
                })
                .then(function (issuer) {
                    var transaction = new StellarSdk.TransactionBuilder(issuer)
                        .addOperation(StellarSdk.Operation.payment({
                            destination: receivingKeys.publicKey(),
                            asset: Blog,
                            amount: '20'
                        }))
                        .build();
                    transaction.sign(issuingKeys);
                    return server.submitTransaction(transaction);
                })
                .catch(function (error) {
                    console.error('Error!', error);
                });
        }
    });
    return {
        "secretKey" : pair.secret(),
        "publicKey" : pair.publicKey(),
    };

}

