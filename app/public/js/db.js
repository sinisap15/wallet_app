// Connection to the database
const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://admin:admin123@localhost:5432/postgres');

module.exports = {
    db
}