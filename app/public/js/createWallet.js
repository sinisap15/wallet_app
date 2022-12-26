const { pool } = require('./db.js');

async function createWallet(user) {
    var userList = await pool.query(`SELECT * FROM accounts WHERE user_id = ${user}`);
    if (userList.rows.length == 0) {
        console.log("User does not exist");
        return;
    };
    var account_wallets = await pool.query(`SELECT * FROM account_wallets WHERE user_id = ${user}`);
    if (account_wallets.rows.length === 0) {
        var query = 'INSERT INTO wallet (funds) VALUES ($1)';
        var data = [0];
        try {
            pool.query(query, data);
            var walletId = await (await (await pool.query(`SELECT max(wallet_id) FROM wallet`)).rows[0].max);
            query = 'INSERT INTO account_wallets (user_id, wallet_id, grant_date) VALUES ($1, $2, $3)';
            data = [user, walletId, new Date()];
            pool.query(query, data);
            console.log(`Created a wallet for user ${user}`);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("User already has a wallet");
    }
}

module.exports = createWallet;
