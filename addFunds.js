const { pool } = require('./server');

// Deposit or win transaction
async function addFunds(addedFunds, wallet_id) {
    var funds = parseInt(await (await pool.query(`SELECT funds FROM wallet WHERE wallet_id = ${wallet_id}`)).rows[0].funds);
    var newFunds = funds + addedFunds;
    const query = 'UPDATE wallet SET funds = $1 WHERE wallet_id = $2'
    const data = [newFunds, wallet_id];
    try {
        pool.query(query, data);
        console.log(`Updated the wallet funds to ${newFunds}`);
    } catch (error) {
        console.error(error);
    }
}

addFunds(300, 1);
