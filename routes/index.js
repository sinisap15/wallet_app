const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Hello from routes folder');
})

router.get('/home', (req, res, next) => {
    res.render('home', null)
})

router.get('/json', (req, res, next) => {
    const data = {
        greeting: 'Hello'
    }
    res.json(data);
});

module.exports = router; // Export the router so that it can be used in other files