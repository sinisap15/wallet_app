const { createNewUser } = require('./app.js')

// Create a new user
async function createUser(username, firstName, lastName, password, email, createdOn) {
    var createdOn = new Date();
    try {
        await createNewUser(username, firstName, lastName, password, email, createdOn);
    } catch (err) {
        console.log(err);
    }
}

module.exports = createUser;