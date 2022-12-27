// Queries 
const { db } = require('./db.js');

async function getUserList() {
    var userList;
    await db.any('SELECT * FROM accounts')
        .then(function (data) {
            userList = data;
        }).catch(function (error) {
            console.log(error);
        })
    return userList;
}

async function getAccountWallets(userId) {
    var accountWallets;
    await db.any('SELECT * FROM account_wallets WHERE user_id = $1', userId)
        .then(function (data) {
            if (data == null) return;
            accountWallets = data;
        }).catch(function (error) {
            console.log(error);
        })
    return accountWallets;
}

async function getWalletId(userId) {
    var walletId;
    await db.one('SELECT wallet_id FROM account_wallets WHERE user_id = $1', userId)
        .then(function (data) {
            walletId = data.wallet_id;
        }).catch(function (error) {
            console.log(error);
        })
    return walletId;
}

async function getFunds(walletId) {
    var funds;
    await db.one('SELECT funds FROM wallet WHERE wallet_id = $1', walletId)
        .then(function (data) {
            funds = parseFloat(data.funds);
        }).catch(function (error) {
            console.log(error);
        })
    return funds;
}

async function getUserId(username) {
    var userId;
    await db.one('SELECT user_id FROM accounts WHERE username = $1', username)
        .then(function (data) {
            userId = data.user_id;
        }).catch(function (error) {
            console.log(error);
        })
    return userId;
}

async function getUsername(userId) {
    var username;
    await db.one('SELECT username FROM accounts WHERE user_id = $1', userId)
        .then(function (data) {
            username = data.username;
        }).catch(function (error) {
            console.log(error);
        })
    return username;
}

async function getTransactions(userId) {
    var transactions;
    await db.any('SELECT * FROM transactions WHERE user_id = $1', userId)
        .then(function (data) {
            transactions = data;
        }).catch(function (error) {
            console.log(error);
        })
    return transactions;
}

async function createNewWallet() {
    await db.query('INSERT INTO wallet (funds) VALUES (0)')
        .then(function () {
            console.log('Created new wallet');
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function linkAccountToWallet(userId, walletId, grantDate) {
    await db.query('INSERT INTO account_wallets (user_id, wallet_id, grant_date) VALUES ($1, $2, $3)', [userId, walletId, grantDate])
        .then(function () {
            console.log('Added new wallet');
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function createNewUser(username, firstName, lastName, password, email, createdOn) {
    await db.query('INSERT INTO accounts (username, firstname, lastname, password, email, created_on) VALUES ($1, $2, $3, $4, $5, $6)',
            [username, firstName, lastName, password, email, createdOn])
            .then(function () {
                console.log(`Added a user with the name ${username}`);
            }).catch(function (error) {
                console.log(error);
            })
}

async function depositFunds(addedFunds, walletId) {
    await db.none('UPDATE wallet SET funds = $1 WHERE wallet_id = $2', [addedFunds, walletId])
    .then(function() {
        console.log('Added funds to wallet');
    }).catch(function(error) {
        console.log(error);
    })
}

async function withdrawFunds(removedFunds, walletId) {
    await db.none('UPDATE wallet SET funds = $1 WHERE wallet_id = $2', [removedFunds, walletId])
    .then(function() {
        console.log('Removed funds from wallet');
    }).catch(function(error) {
        console.log(error);
    })
}

async function createTransaction(userId, fundsBefore, fundsAfter, transactionDate, transactionType) {
    await db.none('INSERT INTO transactions (user_id, funds_before, funds_after, transaction_date, transactiontype) VALUES ($1, $2, $3, $4, $5)', [userId, fundsBefore, fundsAfter, transactionDate, transactionType])
    .then(function() {
        console.log('Added transaction');
    }).catch(function(error) {
        console.log(error);
    })
}

module.exports = {
    getUserList,
    getAccountWallets,
    getWalletId,
    getFunds,
    getUserId,
    getUsername,
    linkAccountToWallet,
    createNewUser,
    getTransactions,
    depositFunds,
    createTransaction,
    withdrawFunds,
    createNewWallet,
}