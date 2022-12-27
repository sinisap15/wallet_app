const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    password: 'admin123',
    port: '5432'
})

// module.exports = { pool };

const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://admin:admin123@localhost:5432/postgres');

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


module.exports = {
    db,
    getWalletId,
    getFunds,
    pool
}