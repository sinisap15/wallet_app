const { pool } = require('./server');

async function modifyData() {
    const [wallet_id, funds] = process.argv.slice(2);
    try {
        const res = await pool.query("UPDATE wallet SET funds = $1 WHERE wallet_id = $2", [
            funds,
            wallet_id,
        ]);
        console.log(`Updated the wallet funds to ${funds}`);
    } catch (error) {
        console.error(error);
    }
}

modifyData();