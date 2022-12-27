const { getUserList } = require('./app.js');
const { getAccountWallets } = require('./app.js');
const { createNewWallet } = require('./app.js');
const { linkAccountToWallet } = require('./app.js');
const { db } = require('./db.js');

// Create a new wallet and link it to the user
async function createWallet(user) {
    var userList = await getUserList();
    if (userList.length == 0) {
        console.log("User does not exist");
        return;
    };
    var account_wallets = await getAccountWallets(user);
    if (account_wallets.length === 0) {
        try {
            await createNewWallet();
            var walletId = await db.one('SELECT max(wallet_id) FROM wallet');
            await linkAccountToWallet(user, walletId.max, new Date());
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("User already has a wallet");
    }
}

module.exports = createWallet;
