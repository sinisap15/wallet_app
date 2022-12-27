const { getFunds } = require('./app.js');
const { getWalletId } = require('./app.js');
const { db } = require('./db.js');
const { depositFunds } = require('./app.js');
const { createTransaction } = require('./app.js');

// Deposit or win transaction
async function addFunds(addedFunds, wallet_id, transactionType) {
    var user = await db.one('SELECT user_id FROM account_wallets WHERE wallet_id = $1', wallet_id)
    var userId = parseInt(user.user_id);
    var walletId = await getWalletId(userId);
    var funds = await getFunds(walletId);
    var newFunds = funds + addedFunds;
    try {
        await depositFunds(newFunds, wallet_id);
        await createTransaction(userId, funds, newFunds, new Date(), transactionType);
    } catch (error) {
        console.error(error);
    }
}

module.exports = addFunds;
