const { pool } = require('./server');

async function insertData() {
    const [username, firstname, lastname, password, email, created_on] = process.argv.slice(2);
    try {
        const res = await pool.query(
        "INSERT INTO accounts (username, firstname, lastname, password, email, created_on) VALUES ($1, $2, $3, $4, $5, $6)",
        [username, firstname, lastname, password, email, created_on]
    );
    console.log(`Added a user with the name ${username}`);
    } catch (err) {
        console.log(err);
    }
}

insertData();