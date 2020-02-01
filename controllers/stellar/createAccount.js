var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.createAccount = function(req, res, next){

    var pair = StellarSdk.Keypair.random();
    
    pair.secret();
    console.log(pair.secret());
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
            server.loadAccount(pair.publicKey()).then(function (account) {
                console.log('Balances for account: ' + pair.publicKey());
                account.balances.forEach(function (balance) {
                    console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                });
            });
            var issuingKeys = StellarSdk.Keypair
                .fromSecret('SCKL62GED46Z6ZXN7IBPQX43KNSQOI62XD7DKNW4FDFYZQUPQZRTHFBV');
            var receivingKeys = pair;
            var Blog = new StellarSdk.Asset('Blog', issuingKeys.publicKey());
            server.loadAccount(receivingKeys.publicKey())
                .then(function (receiver) {
                    var transaction = new StellarSdk.TransactionBuilder(receiver)
                        .addOperation(StellarSdk.Operation.changeTrust({
                            asset: Blog,
                            limit: '1000'
                        }))
                        .build();
                    transaction.sign(receivingKeys);
                    return server.submitTransaction(transaction);
                })
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

