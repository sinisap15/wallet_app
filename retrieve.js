const { pool } = require('./server');

async function retrieveData() {
    try {
        const res = await pool.query(
        "SELECT * FROM accounts"
    );
    console.log(res.rows);
    } catch (err) {
        console.log(err);
    }
}

retrieveData();