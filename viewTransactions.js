const { pool } = require('./server');

async function retrieveData(userId) {
    try {
        const res = await pool.query(
        `SELECT * FROM transactions WHERE user_id = ${userId}`
    );
    console.log(res.rows);
    } catch (err) {
        console.log(err);
    }
}

retrieveData(1);