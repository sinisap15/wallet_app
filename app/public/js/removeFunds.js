const { getFunds } = require('./app.js')
const { getWalletId } = require('./app.js')
const { withdrawFunds } = require('./app.js')
const { createTransaction } = require('./app.js')
const { db } = require('./db.js')

// Withdraw or lose transaction
async function removeFunds(removedFunds, wallet_id, transactionType) {
    var user = await db.one('SELECT user_id FROM account_wallets WHERE wallet_id = $1', wallet_id)
    var userId = parseInt(user.user_id);    var walletId = await getWalletId(userId);
    var funds = await getFunds(walletId);
    if (funds > removedFunds) {
        var newFunds = funds - removedFunds;
        try {
            await withdrawFunds(newFunds, wallet_id);
            await createTransaction(userId, funds, newFunds, new Date(), transactionType);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("Insufficient funds");
    }
}

module.exports = removeFunds;