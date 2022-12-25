const { pool } = require('./db.js')

async function createUser(username, firstName, lastName, password, email, createdOn) {
    var createdOn = new Date();
    try {
        const res = await pool.query(
        "INSERT INTO accounts (username, firstname, lastname, password, email, created_on) VALUES ($1, $2, $3, $4, $5, $6)",
        [username, firstName, lastName, password, email, createdOn]
    );
    console.log(`Added a user with the name ${username}`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = createUser;