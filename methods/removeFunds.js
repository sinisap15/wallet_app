const { pool } = require('./server');

// Withdraw or lose transaction
async function removeFunds(removedFunds, wallet_id) {
    var funds = parseInt(await (await pool.query(`SELECT funds FROM wallet WHERE wallet_id = ${wallet_id}`)).rows[0].funds);
    var userId = parseInt(await (await pool.query(`SELECT user_id FROM wallet WHERE wallet_id = ${wallet_id}`)).rows[0].user_id);
    if (funds > removedFunds) {
        var newFunds = funds - removedFunds;
        var query = 'UPDATE wallet SET funds = $1 WHERE wallet_id = $2'
        var data = [newFunds, wallet_id];
        try {
            pool.query(query, data);
            query = 'INSERT INTO transactions (user_id, funds_before, funds_after, transaction_date) VALUES ($1, $2, $3, $4)';
            data = [user_id, funds, newFunds, new Date()];
            pool.query(query, data);
            console.log(`Updated the wallet funds to ${newFunds}`);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("Insufficient funds");
    }
}

removeFunds(300, 10);
