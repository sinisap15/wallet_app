const { pool } = require('./server');

// Withdraw or lose transaction
async function removeFunds(removedFunds, wallet_id) {
    var funds = parseInt(await (await pool.query(`SELECT funds FROM wallet WHERE wallet_id = ${wallet_id}`)).rows[0].funds);
    if (funds > removedFunds) {
        var newFunds = funds - removedFunds;
        const query = 'UPDATE wallet SET funds = $1 WHERE wallet_id = $2'
        const data = [newFunds, wallet_id];
        try {
            pool.query(query, data);
            console.log(`Updated the wallet funds to ${newFunds}`);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("Insufficient funds");
    }
}

removeFunds(300, 2);
